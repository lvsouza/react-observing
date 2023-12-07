import { useState } from 'react';
import { observe, useObserver, useSelectorValue } from 'react-observing';


const firstNameStore = observe('');
const middleNameStore = observe('');
const lastNameStore = observe('');


export const UseSelectorFullName = () => {
  const [separator, setSeparator] = useState(' ');


  const [firstName, setFirstName] = useObserver(firstNameStore);
  const [middleName, setMiddleName] = useObserver(middleNameStore);
  const [lastName, setLastName] = useObserver(lastNameStore);


  const fullName = useSelectorValue(({ get }) => {
    const firstName = get(firstNameStore);
    const middleName = get(middleNameStore);
    const lastName = get(lastNameStore);

    return `${firstName}${separator}${middleName}${separator}${lastName}`;
  }, [separator]);


  return (
    <div>
      <h1>UseSelector - Full name</h1>

      <p>
        Separator:
        <input
          value={separator}
          onChange={e => setSeparator(e.target.value)}
        />
      </p>

      <p>
        firstName:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </p>
      <p>
        middleName:
        <input
          value={middleName}
          onChange={e => setMiddleName(e.target.value)}
        />
      </p>
      <p>
        lastName:
        <input
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </p>

      <p>(selector) fullName: {fullName}</p>
    </div>
  );
};
