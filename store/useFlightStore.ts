import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Seat = {
  id: string
  seat_number: string
  class: 'economy' | 'business' | 'first'
  extra_fee: number
}

type PassengerForm = {
  fullName: string
  passportNo: string
  nationality: string
}

type SearchQuery = {
  origin: string
  destination: string
  date: string
}

type FlightStore = {
  searchQuery: SearchQuery
  setSearchQuery: (query: SearchQuery) => void

  selectedFlightId: string | null
  setSelectedFlightId: (id: string) => void

  selectedSeat: Seat | null
  setSelectedSeat: (seat: Seat | null) => void

  bookingStep: number
  setBookingStep: (step: number) => void

  passengerForm: PassengerForm
  setPassengerForm: (form: PassengerForm) => void

  resetBooking: () => void
}

export const useFlightStore = create<FlightStore>()(
  persist(
    (set) => ({
      searchQuery: { origin: '', destination: '', date: '' },
      setSearchQuery: (query) => set({ searchQuery: query }),

      selectedFlightId: null,
      setSelectedFlightId: (id) => set({ selectedFlightId: id }),

      selectedSeat: null,
      setSelectedSeat: (seat) => set({ selectedSeat: seat }),

      bookingStep: 1,
      setBookingStep: (step) => set({ bookingStep: step }),

      passengerForm: { fullName: '', passportNo: '', nationality: '' },
      setPassengerForm: (form) => set({ passengerForm: form }),

      resetBooking: () =>
        set({
          selectedFlightId: null,
          selectedSeat: null,
          bookingStep: 1,
          passengerForm: { fullName: '', passportNo: '', nationality: '' },
        }),
    }),
    {
      name: 'flight-store',
     
      partialize: (state) => ({
        searchQuery: state.searchQuery,
        selectedFlightId: state.selectedFlightId,
        selectedSeat: state.selectedSeat,
        bookingStep: state.bookingStep,
        passengerForm: {
          fullName: state.passengerForm.fullName,
          nationality: state.passengerForm.nationality,
          passportNo: '', 
        },
      }),
    }
  )
)