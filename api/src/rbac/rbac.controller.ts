import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('rbac')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RBACController {
  constructor(private readonly prisma: PrismaService) {}

  // List all users (CMIO only)
  @Get('users')
  @Roles('CMIO')
  async getUsers() {
    const users = await this.prisma.rBACUser.findMany({
      include: { role: true },
    });
    return { count: users.length, users };
  }

  // Create new user (CMIO only)
  @Post('users')
  @Roles('CMIO')
  async createUser(@Body() body: { email: string; role_id: number }) {
    const user = await this.prisma.rBACUser.create({
      data: {
        email: body.email,
        role_id: body.role_id,
      },
    });
    return { success: true, user };
  }

  // List all roles (CMIO only)
  @Get('roles')
  @Roles('CMIO')
  async getRoles() {
    const roles = await this.prisma.rBACRole.findMany({
      include: { permissions: true, users: true },
    });
    return { count: roles.length, roles };
  }

  // Create new role (CMIO only)
  @Post('roles')
  @Roles('CMIO')
  async createRole(@Body() body: { name: string }) {
    const existing = await this.prisma.rBACRole.findUnique({
      where: { name: body.name },
    });

    if (existing) {
      return {
        success: false,
        message: `Role '${body.name}' already exists.`,
        role: existing,
      };
    }

    const role = await this.prisma.rBACRole.create({
      data: { name: body.name },
    });

    return { success: true, role };
  }

  // Add permission to role (CMIO only)
  @Post('roles/:id/permissions')
  @Roles('CMIO')
  async addPermission(
    @Param('id') id: string,
    @Body() body: { action: string },
  ) {
    const permission = await this.prisma.rBACPermission.create({
      data: {
        role_id: Number(id),
        action: body.action,
      },
    });
    return { success: true, permission };
  }
}
