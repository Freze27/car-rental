import { Controller, Get, Post, Body, Param, Render, Redirect, Sse } from '@nestjs/common';
import { RentService } from './rent.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { map } from 'rxjs';

const ADMIN_LAYOUT = { layout: 'admin' };

@Controller('rents')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Get()
  @Render('rents/index')
  async findAll() {
    const rents = await this.rentService.findAll();
    return { ...ADMIN_LAYOUT, rents };
  }

  @Get('add')
  @Render('rents/add')
  addForm() {
    return { ...ADMIN_LAYOUT };
  }

  @Get('events')
  @Sse()
  events() {
    return this.rentService.rentEvents$.pipe(
      map(data => ({ data: JSON.stringify(data) })),
    );
  }

  @Get(':id')
  @Render('rents/show')
  async findOne(@Param('id') id: string) {
    const rent = await this.rentService.findOne(+id);
    return { ...ADMIN_LAYOUT, rent };
  }

  @Get(':id/edit')
  @Render('rents/edit')
  async editForm(@Param('id') id: string) {
    const rent = await this.rentService.findOne(+id);
    return { ...ADMIN_LAYOUT, rent };
  }

  @Post()
  @Redirect('/rents')
  async create(@Body() dto: CreateRentDto) {
    await this.rentService.create(dto);
  }

  @Post(':id/update')
  @Redirect('/rents')
  async update(@Param('id') id: string, @Body() dto: UpdateRentDto) {
    await this.rentService.update(+id, dto);
  }

  @Post(':id/delete')
  @Redirect('/rents')
  async remove(@Param('id') id: string) {
    await this.rentService.remove(+id);
  }
}
