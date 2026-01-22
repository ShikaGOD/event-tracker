const STORAGE_KEY = 'events_data';

function loadEvents() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveEvents(events) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

function updateStatistics() {
    const events = loadEvents();
    const stats = {
        total: events.length,
        click: events.filter(e => e.type === 'click').length,
        lead: events.filter(e => e.type === 'lead').length,
        sale: events.filter(e => e.type === 'sale').length
    };

    document.getElementById('totalEvents').textContent = stats.total;
    document.getElementById('clickCount').textContent = stats.click;
    document.getElementById('leadCount').textContent = stats.lead;
    document.getElementById('saleCount').textContent = stats.sale;
}

function renderEventsTable() {
    const events = loadEvents();
    const container = document.getElementById('eventsTableContainer');

    if (events.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div>Поки що немає жодної події. Додайте першу!</div>
            </div>
        `;
        return;
    }

    const sortedEvents = [...events].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Назва події</th>
                    <th>Тип події</th>
                    <th>Дата та час створення</th>
                </tr>
            </thead>
            <tbody>
                ${sortedEvents.map(event => `
                    <tr>
                        <td>${event.name}</td>
                        <td>
                            <span class="event-type type-${event.type}">
                                ${event.type.toUpperCase()}
                            </span>
                        </td>
                        <td>${formatDateTime(event.createdAt)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = tableHTML;
}

function addEvent(name, type) {
    const events = loadEvents();
    const newEvent = {
        id: Date.now(),
        name: name,
        type: type,
        createdAt: new Date().toISOString()
    };
    events.push(newEvent);
    saveEvents(events);
    updateStatistics();
    renderEventsTable();
}

document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('eventName').value.trim();
    const type = document.getElementById('eventType').value;

    if (name && type) {
        addEvent(name, type);
        this.reset();
    }
});

// Ініціалізація при завантаженні сторінки
updateStatistics();
renderEventsTable();