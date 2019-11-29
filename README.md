# Пункты выдачи заказов Почты России (russianpost-pvz)

Отображение пунктов выдачи заказов (ПВЗ) Почты России для услуги ЕКОМ (услуга для корпоративных клиентов).

Для получения списка ПВЗ в JSON-формате используется скрипт на Python (Scripts\GetPVZ.py).  
Скрипт обращается к API otpravka.pochta.ru, для работы нужен токен и ключ:
- https://otpravka.pochta.ru/specification#/authorization-token  
- https://otpravka.pochta.ru/specification#/authorization-key

Используется API Яндекс.Карт (https://tech.yandex.ru/maps/) для отображения ПВЗ на карте.
