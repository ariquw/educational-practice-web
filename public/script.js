var cancelId = null;

function showPage(name) {
    document.getElementById('page-register').style.display = 'none';
    document.getElementById('page-login').style.display = 'none';
    document.getElementById('page-orders').style.display = 'none';
    document.getElementById('page-add').style.display = 'none';
    document.getElementById('page-cancel').style.display = 'none';

    document.getElementById('page-' + name).style.display = 'block';

    if (name === 'orders') {
        loadOrders();
    }
}

document.getElementById('form-register').addEventListener('submit', async (e) => {
    e.preventDefault();
    var data = Object.fromEntries(new FormData(e.target));
    var res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    var result = await res.json();
    if (result.success) {
        showPage('login');
    }
});

document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    var data = Object.fromEntries(new FormData(e.target));
    var res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    var result = await res.json();
    if (result.success) {
        document.getElementById('nav').style.display = 'flex';
        if (result.role === 'admin') {
            document.getElementById('orders-title').textContent = 'Все заявки';
        } else {
            document.getElementById('orders-title').textContent = 'Мои заявки';
        }
        showPage('orders');
    }
});

async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    document.getElementById('nav').style.display = 'none';
    showPage('login');
}

document.getElementById('form-add').addEventListener('submit', async (e) => {
    e.preventDefault();
    var data = Object.fromEntries(new FormData(e.target));
    var res = await fetch('/api/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    var result = await res.json();
    if (result.success) {
        e.target.reset();
        showPage('orders');
    }
});

document.getElementById('form-cancel').addEventListener('submit', async (e) => {
    e.preventDefault();
    var reason = e.target.cancel_reason.value;
    await fetch('/api/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cancelId, status: 'Услуга отменена', cancel_reason: reason })
    });
    e.target.reset();
    cancelId = null;
    showPage('orders');
});

async function loadOrders() {
    var res = await fetch('/api/orders');
    var data = await res.json();
    var container = document.getElementById('orders-list');

    if (!data.orders || data.orders.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#4a5080;">Пусто</p>';
        return;
    }

    var html = '';

    for (var i = 0; i < data.orders.length; i++) {
        var o = data.orders[i];
        var sc = o.status === 'Новая заявка' ? 'status-new' : o.status === 'Услуга оказана' ? 'status-done' : 'status-cancel';

        html += '<div class="card">';
        if (data.role === 'admin') {
            html += '<p><b>Клиент:</b> ' + (o.user_name || '—') + '</p>';
        }
        html += '<p><b>Услуга:</b> ' + o.service_type + '</p>';
        html += '<p><b>Дата:</b> ' + o.desired_date + ' / ' + o.desired_time + '</p>';
        html += '<p><b>Адрес:</b> ' + o.address + '</p>';
        html += '<p><b>Контакты:</b> ' + o.contact + '</p>';
        html += '<p><b>Оплата:</b> ' + o.payment_type + '</p>';
        html += '<p><b>Статус:</b> <span class="' + sc + '">' + o.status + '</span></p>';
        if (o.cancel_reason) {
            html += '<p style="color:#e04a6a;"><b>Причина:</b> ' + o.cancel_reason + '</p>';
        }
        if (data.role === 'admin' && o.status === 'Новая заявка') {
            html += '<button class="button button-green" onclick="changeStatus(' + o.id + ', \'Услуга оказана\')">Выполнено</button>';
            html += '<button class="button button-red" onclick="openCancel(' + o.id + ')">Отменить</button>';
        }
        html += '</div>';
    }

    container.innerHTML = html;
}

async function changeStatus(id, status) {
    await fetch('/api/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, status: status })
    });
    loadOrders();
}

function openCancel(id) {
    cancelId = id;
    showPage('cancel');
}

document.getElementById('nav').style.display = 'none';
showPage('login');