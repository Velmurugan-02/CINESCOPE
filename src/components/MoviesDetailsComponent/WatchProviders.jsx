import React from 'react';
import './WatchProviders.css';

const WatchProviders = ({ providers }) => {
    if (!providers || !providers.results || !providers.results.IN) {
        return null;
    }

    const indiaProviders = providers.results.IN;
    const { flatrate, rent, buy } = indiaProviders;

    const renderProviderList = (list, label) => {
        if (!list || list.length === 0) return null;

        return (
            <div className="provider-group">
                <span className="provider-label">{label}:</span>
                <div className="provider-icons">
                    {list.map((provider) => (
                        <div key={provider.provider_id} className="provider-icon-wrapper" title={provider.provider_name}>
                            <img
                                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                alt={provider.provider_name}
                                className="provider-logo"
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (!flatrate && !rent && !buy) return null;

    return (
        <div className="watch-providers-container">
            <h4 className="watch-title">Where to Watch</h4>
            <div className="providers-content">
                {renderProviderList(flatrate, 'Stream')}
                {renderProviderList(rent, 'Rent')}
                {renderProviderList(buy, 'Buy')}
            </div>
        </div>
    );
};

export default WatchProviders;
