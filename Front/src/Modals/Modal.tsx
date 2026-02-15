import type React from "react";
import type { ReactNode, SetStateAction } from "react";
import { createPortal } from "react-dom";
import { X } from "@boxicons/react";
import "./Modal.css"

interface ModalProps {
    children: ReactNode;
    setSelectedId: React.Dispatch<SetStateAction<number | null>>;
}

export default function Modal({ children, setSelectedId }: ModalProps) {
    return createPortal(
        <div className="overlay" onClick={() => setSelectedId(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="button-close-modal" onClick={() => setSelectedId(null)}><X/></button>
                {children}
            </div>
        </div>,
        document.getElementById("modal-root")!
    )
}