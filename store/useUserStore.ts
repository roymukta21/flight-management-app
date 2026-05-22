import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Session } from '@supabase/supabase-js'

type Booking = {
  id: string
  pnr_code: string
  status: string
  flight_id: string
}

type UserStore = {
  session: Session | null
  setSession: (session: Session | null) => void

  cachedBookings: Booking[]
  setCachedBookings: (bookings: Booking[]) => void

  reset: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),

      cachedBookings: [],
      setCachedBookings: (bookings) => set({ cachedBookings: bookings }),

      reset: () => set({ session: null, cachedBookings: [] }),
    }),
    {
      name: 'user-store',
     
      partialize: (state) => ({
        session: state.session
          ? {
              access_token: state.session.access_token,
              refresh_token: state.session.refresh_token,
            }
          : null,
      }),
    }
  )
)