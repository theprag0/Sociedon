import { makeStyles } from '@material-ui/core';

const useTooltipStyles = makeStyles(theme => ({
    arrow: {
        color: '#f95959',
        fontSize: '1.2rem'
    },
    tooltip: {
        padding: 0,
        backgroundColor: '#fff',
        border: '2px solid #f95959',
        color: '#000',
        boxShadow: '0px 2px 21px 2px rgba(0, 0, 0, 0.2)',
        " -webkit-box-shadow": '0px 2px 21px 2px rgba(0, 0, 0, 0.2)',
        "-moz-box-shadow": '0px 2px 21px 2px rgba(0, 0, 0, 0.2)',
    }
}));

export default useTooltipStyles;