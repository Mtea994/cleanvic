"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Modal } from "@/components/ui/Modal";
import { BookingForm } from "@/components/booking/BookingForm";

interface BookingModalContext {
  openModal: (prefilledService?: string) => void;
  closeModal: () => void;
}

const Ctx = createContext<BookingModalContext | null>(null);

export function useBookingModal(): BookingModalContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBookingModal must be used inside BookingModalProvider");
  return ctx;
}

export function BookingModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [prefilledService, setPrefilledService] = useState<string | undefined>();

  const openModal = useCallback((service?: string) => {
    setPrefilledService(service);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ openModal, closeModal }), [openModal, closeModal]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <Modal open={open} onClose={closeModal} ariaLabel="Get a free quote" width={520}>
        <BookingForm
          variant="modal"
          prefilledService={prefilledService}
          onClose={closeModal}
        />
      </Modal>
    </Ctx.Provider>
  );
}
