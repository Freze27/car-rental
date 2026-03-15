import { Controller, Get, Post, Body, Param, Render, Redirect } from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

const ADMIN_LAYOUT = { layout: 'admin' };

@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get()
  @Render('cars/index')
  async findAll() {
    const cars = await this.carService.findAll();
    return { ...ADMIN_LAYOUT, cars };
  }

  @Get('add')
  @Render('cars/add')
  addForm() {
    return { ...ADMIN_LAYOUT };
  }

  @Get(':id')
  @Render('cars/show')
  async findOne(@Param('id') id: string) {
    const car = await this.carService.findOne(+id);
    return { car };
  }

  @Get(':id/rent')
  @Render('cars/rent')
  async rentForm(@Param('id') id: string) {
    const car = await this.carService.findOne(+id);
    return { car };
  }

  @Get(':id/edit')
  @Render('cars/edit')
  async editForm(@Param('id') id: string) {
    const car = await this.carService.findOne(+id);
    return { ...ADMIN_LAYOUT, car };
  }

  @Post()
  @Redirect('/cars')
  async create(@Body() dto: CreateCarDto) {
    await this.carService.create(dto);
  }

  @Post(':id/update')
  @Redirect('/cars')
  async update(@Param('id') id: string, @Body() dto: UpdateCarDto) {
    await this.carService.update(+id, dto);
  }

  @Post(':id/delete')
  @Redirect('/cars')
  async remove(@Param('id') id: string) {
    await this.carService.remove(+id);
  }
}
