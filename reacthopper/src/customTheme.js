import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import merge from 'lodash.merge';
const colors = require('material-ui/styles/colors');
const colorManipulator = require('material-ui/utils/colorManipulator');

const muiTheme = {
  palette: {
    disabledColor: (0, colorManipulator.fade)(colors.fullWhite, 0.9),
    textColor: colors.grey100,
    canvasColor: '#343434',
    borderColor: (0, colorManipulator.fade)(colors.fullWhite, 0.9),
    primary1Color: colors.limeA200,
    primary2Color: colors.limeA200,
    primary3Color: colors.limeA200
  }
};
const theme = merge(darkBaseTheme, muiTheme)
export default theme;