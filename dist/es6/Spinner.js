import * as React from 'react';
import './Spinner.css';
class Spinner extends React.Component {
    render() {
        return (React.createElement("div", { id: "Loader", className: 'loader', style: {
                zIndex: 100,
                position: 'absolute',
                left: '50%',
            } }));
    }
}
export default Spinner;
