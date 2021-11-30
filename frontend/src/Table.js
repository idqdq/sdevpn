import React from 'react'

const TableHeader = () => {
    return (
        <thead>
            <tr>
                <th>vlan id</th>
                <th>vni</th>
                <th>vlan name</th>
                <th>svi ip</th>
                <th>svi descr</th>
                <th>mtu</th>
                <th>vrf</th>
                <th>mgroup</th>
                <th>arp suppression</th>
            </tr>
        </thead>
    )
}

const buttonStyle = {
    margin: '0px 5px',
}

const TableBody = (props) => {    
    const rows = props.evpnData.map((row, index) => {
        return (
            <tr key={index}>
                <td>{row.vlan_id}</td>
                <td>{row.vni}</td>
                <td>{row.vlan_name}</td>
                <td>{row.svi_ip}</td>
                <td>{row.svi_descr}</td>
                <td>{row.mtu}</td>
                <td>{row.vrf}</td>
                <td>{row.mgroup}</td>
                <td>{row.arpsup ? "on": "off"}</td>
                <td>
                    <button onClick={() => props.evpnEdit(index)} disabled={props.changes[row.vlan_id]==="new"} style={buttonStyle} className="btn btn-outline-primary btn-sm">Edit</button>
                    <button onClick={() => props.evpnRemove(index)} style={buttonStyle} className="btn btn-outline-danger btn-sm">Delete</button>
                </td>
            </tr>

        )
    })

    return <tbody>{rows}</tbody>
}

const Table = (props) => {
    const { evpnData, changes, evpnEdit, evpnRemove } = props

    return (
        <table className="table table-hover">
            <TableHeader />
            <TableBody evpnData={evpnData} changes={changes} evpnEdit={evpnEdit} evpnRemove={evpnRemove}  />
        </table>
    )
}

export default Table