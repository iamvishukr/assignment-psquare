"use client"

import { useState, useEffect } from "react"
import api from "../utils/api"
import TripCard from "../components/TripCard"
import SearchForm from "../components/SearchForm"
import Footer from "../components/Footer"

const Home = () => {
  const [trips, setTrips] = useState([])
  const [filteredTrips, setFilteredTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchFilters, setSearchFilters] = useState({
    from: "",
    to: "",
    date: "",
  })

  useEffect(() => {
    fetchTrips()
  }, [])

  useEffect(() => {
    filterTrips()
  }, [trips, searchFilters])

  const fetchTrips = async () => {
    try {
      setLoading(true)
      const response = await api.get("/trips")
      setTrips(response.data)
      setError("")
    } catch (error) {
      console.error("Error fetching trips:", error)
      setError("Failed to load trips. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filterTrips = () => {
    let filtered = trips

    if (searchFilters.from) {
      filtered = filtered.filter((trip) => trip.from.toLowerCase().includes(searchFilters.from.toLowerCase()))
    }

    if (searchFilters.to) {
      filtered = filtered.filter((trip) => trip.to.toLowerCase().includes(searchFilters.to.toLowerCase()))
    }

    if (searchFilters.date) {
      const searchDate = new Date(searchFilters.date).toDateString()
      filtered = filtered.filter((trip) => new Date(trip.date).toDateString() === searchDate)
    }

    setFilteredTrips(filtered)
  }

  const handleSearch = (filters) => {
    setSearchFilters(filters)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div
          className="relative bg-cover bg-center h-96"
          style={{
            backgroundImage: `url('/city-skyline-at-sunset-with-travel-theme.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-700/80"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-center w-full">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Next Journey</h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Discover available trips and book your seats with ease
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <SearchForm onSearch={handleSearch} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Available Trips</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our carefully selected destinations and enjoy a comfortable journey
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchTrips}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTrips.map((trip) => (
                  <TripCard key={trip._id} trip={trip} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-lg p-8 max-w-md mx-auto">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306A7.962 7.962 0 0112 5c-2.34 0-4.29 1.009-5.824 2.562"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchFilters.from || searchFilters.to || searchFilters.date
                      ? "No trips match your search criteria. Try adjusting your filters."
                      : "No trips are currently available. Check back later or contact support."}
                  </p>
                  {(searchFilters.from || searchFilters.to || searchFilters.date) && (
                    <button
                      onClick={() => setSearchFilters({ from: "", to: "", date: "" })}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Home
