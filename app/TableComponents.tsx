import React from 'react';

export function RowSimpleCheckbox({ value, name, displayText, onChange }: { value: any, name: string, displayText?: string, onChange: any }) {
  return (
    <tr>
      <td colSpan={2} className="text-center">{displayText || name}:</td>
      <td style={{textAlign: "center"}}>
        <input style={{margin: "0"}}
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(name, e.target.checked)} />
      </td>
    </tr>
  );
}
