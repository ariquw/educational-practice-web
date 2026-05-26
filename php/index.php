<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Мой Не Сам</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Didact+Gothic&display=swap" rel="stylesheet">
</head>
<body>
    <div id="app">
        <header>
            <h1>Мой Не Сам</h1>
            <nav id="nav">
                <button onclick="showPage('orders')">Заявки</button>
                <button onclick="showPage('add')">Новая</button>
                <button onclick="logout()">Выход</button>
            </nav>
        </header>

        <main>
            <div id="page-register" class="page">
                <h2>Регистрация</h2>
                <form id="form-register">
                    <input name="name" placeholder="ФИО" required>
                    <input name="phone" placeholder="Телефон" required>
                    <input name="email" placeholder="Email" required>
                    <input name="login" placeholder="Логин" required>
                    <input name="password" type="password" placeholder="Пароль" required>
                    <button type="submit">Зарегистрироваться</button>
                </form>
                <p class="link" onclick="showPage('login')">Войти</p>
            </div>

            <div id="page-login" class="page">
                <h2>Вход</h2>
                <form id="form-login">
                    <input name="login" placeholder="Логин" required>
                    <input name="password" type="password" placeholder="Пароль" required>
                    <button type="submit">Войти</button>
                </form>
                <p class="link" onclick="showPage('register')">Регистрация</p>
            </div>

            <div id="page-orders" class="page">
                <h2 id="orders-title">Мои заявки</h2>
                <div id="orders-list"></div>
            </div>

            <div id="page-add" class="page">
                <h2>Новая заявка</h2>
                <form id="form-add">
                    <input name="address" placeholder="Адрес" required>
                    <input name="contact" placeholder="Контакты" required>
                    <input name="desired_date" type="date" required>
                    <input name="desired_time" type="time" required>
                    <select name="service_type" required>
                        <option value="">Вид услуги</option>
                        <option value="Общий клининг">Общий клининг</option>
                        <option value="Генеральная уборка">Генеральная уборка</option>
                        <option value="Послестроительная уборка">Послестроительная уборка</option>
                        <option value="Химчистка ковров и мебели">Химчистка ковров и мебели</option>
                    </select>
                    <select name="payment_type" required>
                        <option value="">Тип оплаты</option>
                        <option value="Наличные">Наличные</option>
                        <option value="Банковская карта">Банковская карта</option>
                    </select>
                    <button type="submit">Создать</button>
                </form>
            </div>

            <div id="page-cancel" class="page">
                <h2>Отмена заявки</h2>
                <form id="form-cancel">
                    <input name="cancel_reason" placeholder="Причина отмены" required>
                    <button type="submit">Отменить заявку</button>
                </form>
                <p class="link" onclick="showPage('orders')">Назад</p>
            </div>
        </main>
    </div>

    <script src="script.js"></script>
</body>
</html>