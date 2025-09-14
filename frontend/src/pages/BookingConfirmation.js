"use client";

import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import html2canvas from "html2canvas"; 

import Footer from "../components/Footer";
import FlightTicketCard from "./Flight-ticket-card";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDownloadNotification, setShowDownloadNotification] = useState(false);

    const ticketRef = useRef();

  const { booking, trip, paymentInfo } = location.state || {};

  useEffect(() => {
    if (!booking || !trip) {
      navigate("/");
    }
  }, [booking, trip, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const handleDownloadTicket = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2, 
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `ticket_${booking.bookingId}.png`;
      link.click();

      setShowDownloadNotification(true);
      setTimeout(() => setShowDownloadNotification(false), 3000);
    } catch (err) {
      console.error("Error generating ticket:", err);
    }
  };


  const generateQRCode = () => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="white"/>
        <rect x="10" y="10" width="80" height="80" fill="black"/>
        <rect x="20" y="20" width="60" height="60" fill="white"/>
        <rect x="30" y="30" width="40" height="40" fill="black"/>
        <text x="50" y="55" textAnchor="middle" fill="white" fontSize="8">QR</text>
      </svg>
    `)}`;
  };

  const handelView = () => {
    navigate("/boarding-pass", {
      state: { booking },
    });
  };

  if (!booking || !trip) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showDownloadNotification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Downloaded</span>
          <div className="ml-2">
            <p className="text-sm">The ticket has been Downloaded</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Your trip is successfully booked. Enjoy your journey!
          </p>
        </div>

        <div className="mb-8" ref={ticketRef}>
          <FlightTicketCard booking={booking} trip={trip} onDownload={handleDownloadTicket} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={handleDownloadTicket}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Download Ticket</span>
          </button>

          <div
            onClick={handelView}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-center"
          >
            View Ticket
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingConfirmation;
