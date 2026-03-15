# Car Rental
Приложение для аренды автомобилей.

## Ссылка на приложение
https://car-rental-57ea.onrender.com/

## Запуск проекта

```bash
npm install
```

```bash
# development
npm run start:dev

# production
npm run start:prod
```

## Схема БД
<img width="692" height="791" alt="Image" src="https://github.com/user-attachments/assets/db263171-29e1-4e31-b832-342ecf3716f5" />

User — пользователь системы. Хранит имя, email, пароль и аватар.
Category — категория автомобиля (Sport, SUV, Coupe, Sedan). Используется для классификации автопарка.
Car — автомобиль доступный для аренды. Содержит характеристики: мощность, вместимость, тип трансмиссии, суточная стоимость.
CarImage — галерея фотографий автомобиля. Каждое фото привязано к конкретному автомобилю.
Rent — запись об аренде. Связывает пользователя и автомобиль, хранит даты и итоговую стоимость.


## Автор
Anton Ragulin
