import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../lib/error.js";
import { parsePagination, toPaginatedResult, type PaginatedResult } from "../../lib/pagination.js";
import { MemberRole } from "../../generated/prisma/client.js";
import type { OrganizationStatus, Prisma } from "../../generated/prisma/client.js";
import type { ListOrganizationsQuery } from "./schema.js";

export interface OrganizationSummary {
  id: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  createdAt: Date;
  leadCount: number;
  memberCount: number;
}

function buildWhereClause(query: ListOrganizationsQuery): Prisma.OrganizationWhereInput {
  const where: Prisma.OrganizationWhereInput = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { slug: { contains: query.search, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function listOrganizations(
  query: ListOrganizationsQuery,
): Promise<PaginatedResult<OrganizationSummary>> {
  const pagination = parsePagination(query.page, query.pageSize);
  const where = buildWhereClause(query);

  const [rows, total] = await prisma.$transaction([
    prisma.organization.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        createdAt: true,
        _count: { select: { leads: true, members: true } },
      },
      orderBy: { [query.sortBy]: query.sortOrder },
      skip: (pagination.page - 1) * pagination.pageSize,
      take: pagination.pageSize,
    }),
    prisma.organization.count({ where }),
  ]);

  const items = rows.map((org) => ({
    id: org.id,
    name: org.name,
    slug: org.slug,
    status: org.status,
    createdAt: org.createdAt,
    leadCount: org._count.leads,
    memberCount: org._count.members,
  }));

  return toPaginatedResult(items, total, pagination);
}

export async function getOrganizationById(id: string) {
  const organization = await prisma.organization.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      createdAt: true,
      members: {
        where: { role: MemberRole.ADMIN },
        select: { user: { select: { id: true, name: true, email: true } } },
      },
      _count: { select: { leads: true, members: true } },
    },
  });

  if (!organization) {
    throw ApiError.notFound("Organization not found.");
  }

  return organization;
}

export async function updateOrganizationStatus(id: string, status: OrganizationStatus) {
  const organization = await prisma.organization.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!organization) {
    throw ApiError.notFound("Organization not found.");
  }

  if (organization.status === status) {
    return organization;
  }

  return prisma.organization.update({
    where: { id },
    data: { status },
    select: { id: true, name: true, status: true },
  });
}