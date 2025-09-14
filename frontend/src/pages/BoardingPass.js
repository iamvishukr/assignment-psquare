import React, { useRef } from "react";
import { FaPlane } from "react-icons/fa";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function BoardingPass() {
  const location = useLocation();
  const { booking } = location.state || {};
  const ticketRef = useRef();

  const calculateArrivalTime = (departureTime) => {
    if (!departureTime) return "00:00";
    const [time, period] = departureTime.split(" ");
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours);

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    hour += 2; 
    let newMinutes = parseInt(minutes) + 30; 
    if (newMinutes >= 60) {
      hour += 1;
      newMinutes -= 60;
    }

    const finalHour = hour > 12 ? hour - 12 : hour;
    const finalPeriod = hour >= 12 ? "PM" : "AM";
    return `${finalHour}:${newMinutes.toString().padStart(2, "0")} ${finalPeriod}`;
  };

  const handleDownload = async () => {
    const element = ticketRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`boarding-pass-${booking?.passengerInfo?.name || "ticket"}.pdf`);
  };

  return (
    <>
      <div className="min-h-screen mx-auto p-6 max-w-[1600px]">
        <div className="flex items-center justify-between p-6">
          <div>
            <h2 className="text-lg font-semibold">Emirates A380 Airbus</h2>
            <p className="text-sm text-gray-500 mt-1">
              📍 Gümüssuyu Mah. Inönü Cad. No:8, Istanbul 34437
            </p>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xl font-bold text-green-700">${booking.totalAmount}</span>
            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Download
            </button>
          </div>
        </div>

        <div ref={ticketRef} className="flex">
          <div className="w-full max-w-5xl">
            <div className="flex flex-col lg:flex-row rounded-xl border bg-white">
              <div className="flex p-6 flex-col pr-6 min-w-[200px] bg-blue-50 rounded-l-lg">
                <div>
                  <p className="text-2xl font-bold">{booking?.trip?.time}</p>
                  <p className="text-sm text-gray-500">{booking?.trip?.from}</p>
                </div>
                <div className="flex-1 border-l border-dashed my-4 h-12"></div>
                <div>
                  <p className="text-2xl font-bold">{calculateArrivalTime(booking?.trip?.time)}</p>
                  <p className="text-sm text-gray-500">{booking?.trip?.to}</p>
                </div>
              </div>

              <div className="w-full">
                <div className="bg-blue-100 p-4 flex items-center justify-between rounded-tr-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src=""
                      alt="Passenger"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{booking?.passengerInfo?.name}</h3>
                      <p className="text-xs text-gray-500">Boarding Pass N°123</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">Business Class</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="ml-4 flex items-center">
                    <FaPlane size={18} className="m-3" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">
                        {booking?.trip?.date
                          ? new Date(booking.trip.date)
                              .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                              .replace(/ /g, " ")
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center">
                    <FaPlane size={18} className="m-3" />
                    <div>
                      <p className="text-sm text-gray-500">Flight Time</p>
                      <p className="font-medium">{booking?.trip?.time}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center">
                    <FaPlane size={18} className="m-3" />
                    <div>
                      <p className="text-sm text-gray-500">Gate</p>
                      <p className="font-medium">A12</p>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center">
                    <FaPlane size={18} className="m-3" />
                    <div>
                      <p className="text-sm text-gray-500">Seat</p>
                      <p className="font-medium">{booking?.trip?.bookedSeats.join(",")}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between p-4 items-center">
                  <div>
                    <p className="text-xl font-medium">EK</p>
                    <p className="text-xs text-gray-500">ABC12345</p>
                  </div>
                  <div className="h-12 min-w-[200px] bg-[repeating-linear-gradient(90deg,black,black_2px,transparent_2px,transparent_4px)] mt-2"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white border rounded-lg p-6 flex flex-col items-center w-full h-full">
              <img
                src="https://via.placeholder.com/100"
                alt="Boarding map"
                className="rounded shadow"
              />
              <p className="text-sm mt-2 text-gray-500">Flight Path</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl py-6 mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Terms and Conditions</h3>

          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Payments</h4>
              <p>
                If you are purchasing your ticket using a debit or credit card via the Website, we
                will process these payments via the automated secure common payment gateway which
                will be subject to fraud screening purposes.
              </p>
              <p className="mt-2">
                If you do not supply the correct card billing address and/or cardholder information,
                your booking will not be confirmed and the overall cost may increase. We reserve the
                right to cancel your booking if payment is declined for any reason or if you have
                supplied incorrect card information.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Contact Us</h4>
              <p>
                If you have any questions about our Website or our Terms of Use, please contact:
              </p>
              <div className="mt-2">
                <p className="font-medium">Argo Group QCSC</p>
                <p>Argo Tower</p>
                <p>P.O. Box: 22550</p>
                <p>Doha, State of Qatar</p>
                <p className="mt-1">Further contact details can be found at argo.com/help</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
