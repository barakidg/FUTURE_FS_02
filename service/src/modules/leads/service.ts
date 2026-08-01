import type { Lead, Prisma} from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { encryptOptional, decryptOptional } from "../encryption/cipher.js";
import { parsePagination, toPaginatedResult, type PaginatedResult } from "../../lib/pagination.js";
import type { LeadMeta, ListLeadsQuery, DecipheredLead, LeadInput, LeadUpdateInput } from "./schema.js";
import { ApiError } from "../../lib/error.js";
import { LeadStatus, LeadQualification } from "../../generated/prisma/client.js";


function decipherLead(lead: Lead): DecipheredLead {
    return {
        id: lead.id,
        organizationId: lead.organizationId,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        interest: decryptOptional(lead.interestEnc),
        budget: decryptOptional(lead.budgetEnc),
        message: decryptOptional(lead.messageEnc),
        wantsTrainer: lead.wantsTrainer,
        sourceType: lead.sourceType,
        sourceDomain: lead.sourceDomain,
        status: lead.status,
        qualification: lead.qualification,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
    }
}

export async function createLead(input: LeadInput, meta: LeadMeta){
    const lead = await prisma.lead.create({
        data: {
            organizationId: meta.organizationId,
            name: input.name,
            email: input.email ?? null,
            phone: input.phone ?? null,
            interestEnc: encryptOptional(input.interest),
            budgetEnc: encryptOptional(input.budget),
            messageEnc: encryptOptional(input.message),
            wantsTrainer: input.wantsTrainer ?? false,
            sourceType: meta.sourceType,
            sourceDomain: meta.sourceDomain ?? null,
        }
    });

    return decipherLead(lead);
}

function buildWhereClause(organizationId: string, query: ListLeadsQuery): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = { organizationId };

  if (query.status) {
    where.status = query.status;
  }

  if (query.qualification === "UNSET") {
    where.qualification = null;
  } else if (query.qualification) {
    where.qualification = query.qualification;
  }

  if (query.wantsTrainer !== undefined) {
    where.wantsTrainer = query.wantsTrainer;
  }

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { email: { contains: query.search, mode: "insensitive" } },
      { phone: { contains: query.search, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function listLeads(organizationId: string, query: ListLeadsQuery): Promise<PaginatedResult<DecipheredLead>> {
  const pagination = parsePagination(query.page, query.pageSize);
  const where = buildWhereClause(organizationId, query);

  const [rows, total] = await prisma.$transaction([
    prisma.lead.findMany({
      where,
      orderBy: { [query.sortBy]: query.sortOrder },
      skip: (pagination.page - 1) * pagination.pageSize,
      take: pagination.pageSize,
    }),
    prisma.lead.count({ where }),
  ]);

  return toPaginatedResult(rows.map(decipherLead), total, pagination);
}

export async function getLeadById(organizationId: string, leadId: string): Promise<DecipheredLead> {
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, organizationId },
  });

  if (!lead) {
    throw ApiError.notFound("Lead not found.");
  }

  return decipherLead(lead);
}

const LEAD_STATUS_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  [LeadStatus.NEW]: [LeadStatus.CONTACTED, LeadStatus.CONVERTED, LeadStatus.LOST],
  [LeadStatus.CONTACTED]: [LeadStatus.CONVERTED, LeadStatus.LOST],
  [LeadStatus.CONVERTED]: [],
  [LeadStatus.LOST]: [],
};

export async function updateLeadStatus(
  organizationId: string,
  leadId: string,
  status: LeadStatus,
): Promise<DecipheredLead> {
  const lead = await prisma.lead.findFirst({ where: { id: leadId, organizationId } });

  if (!lead) {
    throw ApiError.notFound("Lead not found.");
  }

  if (lead.status === status) {
    return decipherLead(lead);
  }

  if (!LEAD_STATUS_TRANSITIONS[lead.status].includes(status)) {
    throw ApiError.conflict(`Cannot move a lead from ${lead.status} to ${status}.`);
  }

  const updated = await prisma.lead.update({ where: { id: leadId }, data: { status } });
  return decipherLead(updated);
}

export async function updateLeadQualification(organizationId: string, leadId: string, qualification: LeadQualification | null): Promise<DecipheredLead> {
  const lead = await prisma.lead.update({
    where: { id: leadId, organizationId },
    data: { qualification }
  })

  return decipherLead(lead);
}

export async function updateLead(
  organizationId: string,
  leadId: string,
  input: LeadUpdateInput,
): Promise<DecipheredLead> {
  const existing = await prisma.lead.findFirst({ where: { id: leadId, organizationId } });
  if (!existing) {
    throw ApiError.notFound("Lead not found.");
  }

  const nextEmail = input.email !== undefined ? input.email : existing.email;
  const nextPhone = input.phone !== undefined ? input.phone : existing.phone;
  if (!nextEmail && !nextPhone) {
    throw ApiError.badRequest("A lead must have at least an email or a phone number.");
  }

  const updated = await prisma.lead.update({
    where: { id: leadId },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.interest !== undefined && { interestEnc: encryptOptional(input.interest) }),
      ...(input.budget !== undefined && { budgetEnc: encryptOptional(input.budget) }),
      ...(input.message !== undefined && { messageEnc: encryptOptional(input.message) }),
      ...(input.wantsTrainer !== undefined && { wantsTrainer: input.wantsTrainer }),
    },
  });

  return decipherLead(updated);
}

export async function deleteLead(organizationId: string, leadId: string): Promise<void> {
  const existing = await prisma.lead.findFirst({ where: { id: leadId, organizationId }, select: { id: true } });
  if (!existing) {
    throw ApiError.notFound("Lead not found.");
  }
  await prisma.lead.delete({ where: { id: leadId } });
}