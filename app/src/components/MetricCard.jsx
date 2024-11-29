import React from 'react';
import PropTypes from 'prop-types';

const MetricCard = ({ title, value, unit }) => {
    return (
        <div className="card text-center">
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text display-5">{value ?? '--'}</p>
                <p className="text-muted">{unit}</p>
            </div>
        </div>
    );
};

MetricCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    unit: PropTypes.string,
};

MetricCard.defaultProps = {
    value: null,
    unit: '',
};

export default MetricCard;

