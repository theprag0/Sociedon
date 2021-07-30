function alertHelper(type) {
    const alerts = {
        warning: {
            iconClass: "fas fa-exclamation-triangle",
            id: 'warning',
            color: '#eed202'
        },
        success: {
            iconClass: 'far fa-check-circle',
            id: 'success',
            color: '#4bb543'
        },
        error: {
            iconClass: 'fas fa-exclamation-circle',
            id: 'error',
            color: '#ff0033'
        },
        welcome: {
            emoji: '🤩'
        }
    };

    return alerts[type];
}

export default alertHelper;