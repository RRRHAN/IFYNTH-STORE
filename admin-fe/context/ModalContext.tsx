// context/ModalContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import {
  Icon,
  CloseIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from "@/components/ui/icon";

import { Spinner } from "@/components/ui/spinner";

interface ModalContextType {
  showModal: (options: {
    title: string;
    message: string;
    type: "success" | "error" | "info";
    onConfirm?: () => void;
    onCancel?: () => void;
    showCancelButton?: boolean;
    confirmButtonText?: string;
    cancelButtonText?: string;
    autoClose?: boolean;
    duration?: number;
  }) => void;
  hideModal: () => void;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  isLoading: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useGlobalModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useGlobalModal must be used within a GlobalModalProvider");
  }
  return context;
};

interface GlobalModalProviderProps {
  children: ReactNode;
}

export const GlobalModalProvider: React.FC<GlobalModalProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [onConfirmCallback, setOnConfirmCallback] = useState<
    (() => void) | null
  >(null);
  const [onCancelCallback, setOnCancelCallback] = useState<(() => void) | null>(
    null
  );
  const [showCancel, setShowCancel] = useState(false);
  const [confirmText, setConfirmText] = useState("OK");
  const [cancelText, setCancelText] = useState("Cancel");
  const [autoCloseModal, setAutoCloseModal] = useState(2000);
  const [autoCloseDuration, setAutoCloseDuration] = useState(2000);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  const showModal = useCallback(
    (options: {
      title: string;
      message: string;
      type: "success" | "error" | "info";
      onConfirm?: () => void;
      onCancel?: () => void;
      showCancelButton?: boolean;
      confirmButtonText?: string;
      cancelButtonText?: string;
      autoClose?: boolean;
      duration?: number;
    }) => {
      setIsLoading(false);

      setModalTitle(options.title);
      setModalMessage(options.message);
      setModalType(options.type);
      setOnConfirmCallback(() => options.onConfirm || null);
      setOnCancelCallback(() => options.onCancel || null);
      setShowCancel(options.showCancelButton || false);
      setConfirmText(options.confirmButtonText || "OK");
      setCancelText(options.cancelButtonText || "Cancel");
      setIsOpen(true);
      if (options.autoClose) {
        setAutoCloseDuration(options.duration || 2000);
      } else {
        setAutoCloseDuration(0);
      }
    },
    []
  );

  const hideModal = useCallback(() => {
    setIsOpen(false);
    setModalTitle("");
    setModalMessage("");
    setModalType("info");
    setOnConfirmCallback(null);
    setOnCancelCallback(null);
    setShowCancel(false);
    setConfirmText("OK");
    setCancelText("Cancel");
    setAutoCloseDuration(2000);
  }, []);

  const showLoading = useCallback(
    (message = "Loading...") => {
      hideModal();
      setLoadingMessage(message);
      setIsLoading(true);
    },
    [hideModal]
  );

  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage("Loading...");
  }, []);

  const handleConfirm = () => {
    if (onConfirmCallback) {
      onConfirmCallback();
    }
    hideModal();
  };

  const handleCancel = () => {
    if (onCancelCallback) {
      onCancelCallback();
    }
    hideModal();
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isOpen && autoCloseDuration > 0) {
      timer = setTimeout(() => {
        hideModal();
      }, autoCloseDuration);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isOpen, autoCloseDuration, hideModal]);

  const getIcon = () => {
    switch (modalType) {
      case "success":
        return CheckCircleIcon;
      case "error":
        return AlertCircleIcon;
      case "info":
      default:
        return CloseIcon;
    }
  };

  const getIconColorClass = () => {
    switch (modalType) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "info":
      default:
        return "text-blue-500";
    }
  };

  return (
    <ModalContext.Provider
      value={{ showModal, hideModal, showLoading, hideLoading, isLoading }}
    >
      {children}

      <Modal
        isOpen={isOpen}
        onClose={hideModal}
        size="sm"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader className="flex-row items-center">
            <Icon
              as={getIcon()}
              size="md"
              className={`${getIconColorClass()} mr-2`}
            />
            <Heading size="md" className="text-typography-950">
              {modalTitle}
            </Heading>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text size="md" className="text-typography-500">
              {modalMessage}
            </Text>
          </ModalBody>
          <ModalFooter>
            {showCancel && (
              <Button
                variant="outline"
                action="secondary"
                onPress={handleCancel}
                className="mr-2"
              >
                <ButtonText>{cancelText}</ButtonText>
              </Button>
            )}
            <Button
              action={modalType === "error" ? "negative" : "primary"}
              onPress={handleConfirm}
            >
              <ButtonText>{confirmText}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isLoading && (
        <Modal isOpen={true} size="xs">
          <ModalBackdrop />
          <ModalContent className="bg-transparent shadow-none items-center justify-center">
            <Spinner color="$white" size="large" />
            <Text className="text-white mt-4">{loadingMessage}</Text>
          </ModalContent>
        </Modal>
      )}
    </ModalContext.Provider>
  );
};