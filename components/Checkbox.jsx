import { useEffect, useState } from "react";

export default function CheckBox({ checked, onChange, ...props}) {

    let defaultChecked = checked;
    const [isChecked, setIsChecked] = useState(defaultChecked);

    useEffect(() => {
        console.log("Check: " + checked)
        setIsChecked(checked)
    }, [checked])

    return (
        <>

            <div className={checked ? "checked checkbox": "checkbox"} onClick={(event) => {
                const _checked = !isChecked;
                setIsChecked(_checked)
                event.target.checked = _checked;
                onChange(event)                

            }}>
                <div className={(isChecked ? "fill filled" : "fill unfilled")}></div>
            </div>

            <style jsx>{`

                .checkbox {
                    width:  20px;
                    height: 20px;
                    border: 2px solid var(--gray-900);
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 200ms cubic-bezier(0,1.5,1,1.5);
                }
                .fill {
                    width: 100%;
                    height: 100%;
                    transition: all 200ms cubic-bezier(0,1.5,1,1.5);
                    opacity: 1;
                }
                .filled {
                    background: var(--gray-900);
                }
                .unfilled {
                    background: transparent;
                }

            `}</style>
        </>
    );
}