import moment from 'moment';

const groupMessagesByDate = msgArr => {
    const groupedMessages = msgArr.reduce((dateGroup, message) => {
        const date = moment(message.timestamp).format('DD-MM-YYYY');
        if(!dateGroup[date]) {
            dateGroup[date] = [];
        }
        dateGroup[date].push(message);
        return dateGroup;
    }, {});

    return groupedMessages;
}

export default groupMessagesByDate;