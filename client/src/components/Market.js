import React, { useState, useEffect } from 'react';

export default function PokeMarket({ telegramId }) {
  const [activeTab, setActiveTab] = useState('market');
  const [marketListings, setMarketListings] = useState([]);
  const [auctionListings, setAuctionListings] = useState([]);
  const [tradeListings, setTradeListings] = useState([]);

  useEffect(() => {
    if (activeTab === 'market') fetchMarketListings();
    else if (activeTab === 'auction') fetchAuctionListings();
    else if (activeTab === 'trade') fetchTradeListings();
  }, [activeTab]);

  const fetchMarketListings = async () => {
    try {
      const res = await fetch('/api/market/market');
      const data = await res.json();
      setMarketListings(data);
    } catch (error) {
      console.error('Failed to fetch market listings:', error);
    }
  };

  const fetchAuctionListings = async () => {
    try {
      const res = await fetch('/api/market/auction');
      const data = await res.json();
      setAuctionListings(data);
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
    }
  };

  const fetchTradeListings = async () => {
    try {
      const res = await fetch('/api/market/trade');
      const data = await res.json();
      setTradeListings(data);
    } catch (error) {
      console.error('Failed to fetch trade listings:', error);
    }
  };

  const handleBuyPokemon = async (listingId, price) => {
    try {
      await fetch(`/api/market/market/buy/${listingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerId: telegramId }),
      });
      fetchMarketListings();
    } catch (error) {
      console.error('Failed to buy Pokémon:', error);
    }
  };

  const handleBidOnAuction = async (auctionId) => {
    const bidAmount = prompt('Enter bid amount:');
    if (!bidAmount) return;

    try {
      await fetch(`/api/market/auction/${auctionId}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidderId: telegramId, bidAmount: parseInt(bidAmount) }),
      });
      fetchAuctionListings();
    } catch (error) {
      console.error('Failed to bid:', error);
    }
  };

  return (
    <div className="poke-market">
      <h1>PokéMarket</h1>

      <div className="market-tabs">
        <button
          className={activeTab === 'market' ? 'active' : ''}
          onClick={() => setActiveTab('market')}
        >
          Market
        </button>
        <button
          className={activeTab === 'auction' ? 'active' : ''}
          onClick={() => setActiveTab('auction')}
        >
          Auction House
        </button>
        <button
          className={activeTab === 'trade' ? 'active' : ''}
          onClick={() => setActiveTab('trade')}
        >
          Trade Center
        </button>
      </div>

      {activeTab === 'market' && (
        <div className="market-tab">
          <h2>Market - Fixed Price</h2>
          <div className="listings-grid">
            {marketListings.map((listing) => (
              <div key={listing._id} className="listing-card">
                <h4>Pokémon #{listing.pokemonInstanceId?.speciesId}</h4>
                <p>Price: {listing.price} ₽</p>
                <p>Seller: {listing.sellerId}</p>
                <button onClick={() => handleBuyPokemon(listing._id, listing.price)}>
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'auction' && (
        <div className="auction-tab">
          <h2>Auction House</h2>
          <div className="listings-grid">
            {auctionListings.map((auction) => (
              <div key={auction._id} className="listing-card">
                <h4>Pokémon #{auction.pokemonInstanceId?.speciesId}</h4>
                <p>Current Bid: {auction.currentBid} ₽</p>
                <p>Ends: {new Date(auction.endsAt).toLocaleString()}</p>
                <button onClick={() => handleBidOnAuction(auction._id)}>Place Bid</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'trade' && (
        <div className="trade-tab">
          <h2>Trade Center - P2P Trading</h2>
          <div className="listings-grid">
            {tradeListings.map((listing) => (
              <div key={listing._id} className="listing-card">
                <h4>Pokémon #{listing.pokemonInstanceId?.speciesId}</h4>
                <p>Seller: {listing.sellerId}</p>
                <p>Trade Offers: {listing.tradeRequests?.length || 0}</p>
                <button onClick={() => console.log('Send trade offer')}>Send Offer</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
