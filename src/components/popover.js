import React, { useRef, useState, useEffect } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { usePopper } from 'react-popper';
import { ChevronDownIcon } from '@heroicons/react/solid';

function MyPopover() {

    // https://www.davedrinks.coffee/how-do-i-use-two-react-refs/
    const mergeRefs = (...refs) => {
        const filteredRefs = refs.filter(Boolean);
        if (!filteredRefs.length) return null;
        if (filteredRefs.length === 0) return filteredRefs[0];
        return inst => {
            for (const ref of filteredRefs) {
                if (typeof ref === 'function') {
                    ref(inst);
                } else if (ref) {
                    ref.current = inst;
                }
            }
        };
    };

    let [referenceElement, setReferenceElement] = useState(null)
    let [popperElement, setPopperElement] = useState(null)
    const [arrowElement, setArrowElement] = useState(null)
    let { styles, attributes } = usePopper(referenceElement, popperElement)

    let timeout // NodeJS.Timeout
    const timeoutDuration = 400

    const buttonRef = useRef(false)
    const [openState, setOpenState] = useState(null)

    const toggleMenu = () => {
        // log the current open state in React (toggle open state)
        setOpenState((openState) => !openState)
        // // toggle the menu by clicking on buttonRef
        buttonRef?.current?.click() // eslint-disable-line
    }

    // Open the menu after a delay of timeoutDuration
    const onHover = (open, action) => {
        // if the modal is currently closed, we need to open it
        // OR
        // if the modal is currently open, we need to close it
        if (
            (!open && !openState && action === "onMouseEnter") ||
            (open && openState && action === "onMouseLeave")
        ) {
            // clear the old timeout, if any
            clearTimeout(timeout)
            // open the modal after a timeout
            timeout = setTimeout(() => toggleMenu(open), timeoutDuration)
        }
        // else: don't click! 😁
    }

    const handleClick = (open) => {
        setOpenState(!open) // toggle open state in React state
        clearTimeout(timeout) // stop the hover timer if it's running
    }

    const handleClickOutside = (event) => {
        if (buttonRef.current && !buttonRef.current.contains(event.target)) {
            event.stopPropagation()
        }
    }
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    })

    return (
        <Popover className={`text-gray-900 inline-flex items-center pt-1 border-b-2 text-sm font-medium`}
        >
            {({ open }) => (
                <>
                    <div
                        onMouseEnter={() => onHover(open, "onMouseEnter")}
                        onMouseLeave={() => onHover(open, "onMouseLeave")}
                        className="flex flex-col"
                    >
                        <Popover.Button
                            ref={mergeRefs(setReferenceElement, buttonRef)}
                            className={`
    ${open ? '' : 'text-opacity-90'}
    border-indigo-500 text-gray-900 inline-flex items-center text-sm font-medium`}
                            onClick={() => handleClick(open)}
                        >
                            <span>Solutions</span>
                            <ChevronDownIcon
                                className={`
${open ? '-rotate-180' : ''}
ml-2 h-5 w-5 text-orange-300 group-hover:text-opacity-80 transition ease-in-out duration-150`}
                                aria-hidden="true"
                            />
                        </Popover.Button>
                        <Transition
                            show={open}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel static
                                class="z-10"
                                ref={setPopperElement}
                                style={styles.popper}
                                {...attributes.popper}
                            >
                                <a href="/analytics">Analytics</a>
                                <a href="/engagement">Engagement</a>
                                <a href="/security">Security</a>
                                <a href="/integrations">Integrations</a>
                            </Popover.Panel>
                        </Transition>
                    </div>
                </>
            )}
        </Popover>
    )
}
export default MyPopover