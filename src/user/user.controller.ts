import { Controller, Get, Post, Body, Param, Render, Redirect } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const ADMIN_LAYOUT = { layout: 'admin' };

@ApiExcludeController()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Render('users/index')
  async findAll() {
    const users = await this.userService.findAll();
    return { ...ADMIN_LAYOUT, users };
  }

  @Get('add')
  @Render('users/add')
  addForm() {
    return { ...ADMIN_LAYOUT };
  }

  @Get(':id')
  @Render('users/show')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    return { user };
  }

  @Get(':id/edit')
  @Render('users/edit')
  async editForm(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    return { ...ADMIN_LAYOUT, user };
  }

  @Post()
  @Redirect('/users')
  async create(@Body() dto: CreateUserDto) {
    await this.userService.create(dto);
  }

  @Post(':id/update')
  @Redirect('/users')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    await this.userService.update(+id, dto);
  }

  @Post(':id/delete')
  @Redirect('/users')
  async remove(@Param('id') id: string) {
    await this.userService.remove(+id);
  }
}
