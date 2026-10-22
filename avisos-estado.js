export function mudancasDeStatus(previous,orders){return orders.filter(o=>previous[o.id]&&previous[o.id]!==o.status).map(o=>({id:o.id,status:o.status}))}
