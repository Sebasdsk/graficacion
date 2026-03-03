import type React from "react";
import type { ReactNode, SetStateAction } from "react";
import { createPortal } from "react-dom";
import { X } from "@boxicons/react";
import "./Modal.css"

interface ModalCreateProps {
    children: ReactNode;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
}

export default function ModalCreate({ children, setOpen }: ModalCreateProps) {
    return createPortal(
        <div className="overlay" onClick={() => setOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="button-close-modal" onClick={() => setOpen(false)}><X /></button>
                {children}
            </div>
        </div>,
        document.getElementById("modal-root")!
    )
}