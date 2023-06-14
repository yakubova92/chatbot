import styles from "./CallToActionInput.module.css";
import { useState, useRef, useEffect } from "react";
import Badge from "@leafygreen-ui/badge";
import Card from "@leafygreen-ui/card";
import { Body, Link } from "@leafygreen-ui/typography";
import IconInput from "./IconInput";
import ChatbotModalContent, {
  EmptyConversation,
  ConversationWithMessages,
} from "./Modal";
import useConversation from "./useConversation";
import { Transition, CSSTransition } from "react-transition-group";
import { useClickAway } from "@uidotdev/usehooks";

// type ReactTransitionGroupState = "entering" | "entered" | "exiting" | "exited";

// function CTACard({ state }: { state: ReactTransitionGroupState }) {
//   let cardClassName = `${styles.card} ${transitionClassName[state]}`;
//   if (state === "exited") {
//     cardClassName += ` ${styles["s-unfocused"]}`;
//   }
//   return (
//     <Card ref={cardRef} className={cardClassName}>
//       {showMainInput ? (
//         <IconInput
//           glyph="Wizard"
//           aria-label="MongoDB AI Chatbot Message Input"
//           aria-labelledby="TBD - FIXME"
//           placeholder="Ask MongoDB AI a Question"
//           onFocus={() => {
//             if (!modalOpen) {
//               setModalOpen(true);
//             }
//           }}
//           value={inputText}
//           onChange={(e) => {
//             setInputText(e.target.value);
//           }}
//         />
//       ) : null}
//       {!modalOpen ? (
//         <div className={styles.cta_disclosure}>
//           <Badge variant="blue">Experimental</Badge>
//           <Body>
//             By interacting with this chatbot, you agree to xyz.{" "}
//             <Link href="#">Terms & Conditions</Link>
//           </Body>
//         </div>
//       ) : (
//         <div className={styles.modal_content}>
//           {isEmptyConversation ? (
//             <EmptyConversation {...conversation} />
//           ) : (
//             <ConversationWithMessages {...conversation} />
//           )}
//         </div>
//       )}
//     </Card>
//   );
// }

type CallToActionInputProps = {};

export default function CallToActionInput(props: CallToActionInputProps) {
  const conversation = useConversation();
  const isEmptyConversation = conversation.messages.length === 0;
  const [modalOpen, setModalOpen] = useState(false);

  const cardBoundingBoxRef = useClickAway(() => {
    setModalOpen(false);
  });

  const cardRef = useRef<HTMLDivElement>(null);

  const transitionClassName = {
    entering: " s-focused s-entering",
    entered: " s-focused s-entered",
    exiting: " s-focused s-exiting",
    exited: "",
  };

  const showMainInput = !modalOpen || isEmptyConversation;

  const [inputText, setInputText] = useState("");
  const handleSubmit = () => {
    conversation.addMessage("user", inputText);
    setInputText("");
  };

  return (
    <div className={styles.cta_container} ref={cardBoundingBoxRef}>
      <form
        className={styles.input_form}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Transition
          nodeRef={cardRef}
          in={modalOpen}
          timeout={{
            appear: 250,
            enter: 250,
            exit: 250,
          }}
        >
          {(state: "entering" | "entered" | "exiting" | "exited") => {
            let cardClassName = `${styles.card} ${transitionClassName[state]}`;
            if (state === "exited") {
              cardClassName += ` ${styles["s-unfocused"]}`;
            }
            return (
              <Card ref={cardRef} className={cardClassName}>
                {showMainInput ? (
                  <IconInput
                    glyph="Wizard"
                    aria-label="MongoDB AI Chatbot Message Input"
                    aria-labelledby="TBD - FIXME"
                    placeholder="Ask MongoDB AI a Question"
                    onFocus={() => {
                      if (!modalOpen) {
                        setModalOpen(true);
                      }
                    }}
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                    }}
                  />
                ) : null}
                {!modalOpen ? (
                  <div className={styles.cta_disclosure}>
                    <Badge variant="blue">Experimental</Badge>
                    <Body>
                      By interacting with this chatbot, you agree to xyz.{" "}
                      <Link href="#">Terms & Conditions</Link>
                    </Body>
                  </div>
                ) : (
                  <div className={styles.modal_content}>
                    {isEmptyConversation ? (
                      <EmptyConversation {...conversation} />
                    ) : (
                      <ConversationWithMessages {...conversation} />
                    )}
                  </div>
                )}
              </Card>
            );
          }}
        </Transition>
      </form>
    </div>
  );
}
