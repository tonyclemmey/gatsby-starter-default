import React, { useState } from 'react'
import { Popover } from '@headlessui/react'
import { usePopper } from 'react-popper'

function MyPopover() {
  let [referenceElement, setReferenceElement] = useState()
  let [popperElement, setPopperElement] = useState()
  let { styles, attributes } = usePopper(referenceElement, popperElement)

  return (
    <Popover>
      <Popover.Button ref={setReferenceElement}>Solutions</Popover.Button>

      <Popover.Panel
        className="z-10"
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
      >
        <div className="grid grid-cols-2">
          <a href="/analytics">Analytics</a>
          <a href="/engagement">Engagement</a>
          <a href="/security">Security</a>
          <a href="/integrations">Integrations</a>
        </div>
      </Popover.Panel>
    </Popover>
  )
}
 export default MyPopover