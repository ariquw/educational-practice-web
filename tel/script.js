function showPage(name) {
    document.querySelectorAll('.page').forEach(function(p) {
        p.style.display = 'none';
    });
    document.getElementById('page-' + name).style.display = 'flex';
}

showPage('register');