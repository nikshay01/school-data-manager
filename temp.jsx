import React, {useState, useEffect, useRef, useMemo,useCallback} from 'react';

export function getMockStudents() {
  console.log("Generating 150 mock students...");
  const classes = ['Nur', 'KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const sections = ['A', 'B', 'C', 'D'];
  const states = ['Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh', 'Gujarat', 'Kerala', 'Karnataka'];
  const random = (arr) => arr[Math.floor(Math.random()*arr.length)];

  const students = Array.from({length:150}).map((_, idx) => {
    const id = idx + 1;
    const hasMissing = Math.random() < 0.18;
    const dob = new Date(2005 + Math.floor(Math.random()*8), Math.floor(Math.random()*12), Math.floor(Math.random()*28)+1);
    const adDate = new Date(2015 + Math.floor(Math.random()*8), Math.floor(Math.random()*12), Math.floor(Math.random()*28)+1);

    const fees = {
      adFee: Math.random() < 0.05 ? null : 1000 + Math.floor(Math.random()*4000),
      fee: Math.random() < 0.05 ? null : 15000 + Math.floor(Math.random()*30000),
      bus: Math.random() < 0.2 ? 0 : (Math.random()<0.1?null:2000 + Math.floor(Math.random()*3000)),
      hostel: Math.random() < 0.85 ? 0 : (10000 + Math.floor(Math.random()*20000)),
      discount: Math.random() < 0.3 ? 0 : Math.floor(Math.random()*2000),
      concessionBy: Math.random() < 0.85 ? '' : ['Govt','Management'][Math.floor(Math.random()*2)]
    };

    const paymentsCount = Math.floor(Math.random()*4);
    const payments = Array.from({length: paymentsCount}).map((__,pidx)=>({
      amount: Math.floor(Math.random()*(fees.fee?fees.fee/(paymentsCount||1):5000)),
      rn: `RN-${id}-${pidx+1}`,
      date: new Date(2019 + Math.floor(Math.random()*6), Math.floor(Math.random()*12), Math.floor(Math.random()*28)+1).toISOString().slice(0,10)
    }));

    return {
      studentName: hasMissing && Math.random()<0.5 ? '' : `Student ${id} ${['','Jr.','Sr.'][Math.floor(Math.random()*3)]}`.trim(),
      fatherName: hasMissing && Math.random()<0.4 ? '' : `Father ${id}`,
      class: Math.random()<0.02 ? '' : random(classes),
      section: Math.random()<0.03 ? '' : random(sections),
      srNo: id,
      address: Math.random()<0.25 ? '' : `Village ${Math.ceil(Math.random()*200)}, District ${['North','South','East','West'][Math.floor(Math.random()*4)]}`,
      State: random(states),
      contact: Math.random()<0.2 ? '' : `9${Math.floor(100000000 + Math.random()*900000000)}`,
      aadhar: Math.random()<0.4 ? '' : `${Math.floor(100000000000 + Math.random()*899999999999)}`,
      adDate: adDate.toISOString().slice(0,10),
      dob: dob.toISOString().slice(0,10),
      penID: Math.random()<0.5 ? '' : `PEN${10000+id}`,
      apaarID: Math.random()<0.6 ? '' : `APAAR${1000+id}`,
      leftSchool: Math.random()<0.05 ? true : false,
      tcNumber: Math.random()<0.85 ? '' : `TC${5000+id}`,
      udiseRemoved: Math.random()<0.95 ? false : true,
      leftDate: Math.random()<0.95 ? '' : new Date(2020,0,1 + Math.floor(Math.random()*1000)).toISOString().slice(0,10),
      studentPhoto: '',
      fees,
      payments
    };
  });

  console.log("Mock student generation complete.");
  return students;
}



export function StudentProfileModal({student, open, onClose, onSave}){
  const [local, setLocal] = useState(student || {});
  useEffect(()=> setLocal(student || {}), [student]);
  useEffect(()=> { if(open) console.log('[Modal] Opened for', student?.srNo); }, [open, student]);
  if(!open) return null;

  const save = ()=>{
    console.log('[Modal] Saving student', local?.srNo);
    onSave && onSave(local);
    onClose && onClose();
  };

  return (
    React.createElement('div', {className:'fixed inset-0 z-50 flex items-center justify-center p-6'},
      React.createElement('div', {className:'absolute inset-0 bg-black/40 backdrop-blur-sm', onClick: onClose}),
      React.createElement('div', {className:'relative w-full max-w-4xl max-h-[85vh] overflow-auto p-6 rounded-2xl bg-white/10'},
        React.createElement('div', {className:'flex justify-between items-center mb-4'},
          React.createElement('h2', {className:'text-xl font-semibold'}, 'Student Profile'),
          React.createElement('button', {onClick: onClose, className:'px-3 py-1 rounded-md bg-white/5'}, '✕')
        ),
        React.createElement('div', {className:'grid grid-cols-2 gap-4'},
          ['studentName','fatherName','class','section','srNo','aadhar','contact','address','State','dob','adDate','penID','apaarID','tcNumber','leftDate'].map((field)=> (
            React.createElement('div', {key: field, className:'flex flex-col'},
              React.createElement('label', {className:'text-sm opacity-80'}, field),
              React.createElement('input', {className:'p-2 rounded-md bg-white/5', value: local?.[field] || '', onChange: (e)=> setLocal({...local, [field]: e.target.value})})
            )
          ))
        ),
        React.createElement('div', {className:'mt-6 flex justify-end gap-3'},
          React.createElement('button', {onClick: onClose, className:'px-4 py-2 rounded-md bg-white/5'}, 'Cancel'),
          React.createElement('button', {onClick: save, className:'px-4 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white'}, 'Save')
        )
      )
    )
  );
}

export function FeesCell({fees, payments}){
  const totals = useMemo(()=>{
    if(!fees || fees.fee == null) return null;
    const total = (Number(fees.fee) || 0) + (Number(fees.bus) || 0) + (Number(fees.hostel) || 0) + (Number(fees.adFee) || 0) - (Number(fees.discount) || 0);
    const received = (payments || []).reduce((s,p)=> s + (Number(p.amount)||0), 0);
    const due = total - received;
    return {total, received, due};
  }, [fees, payments]);

  if(!totals) return React.createElement('div', {className:'italic'}, '—');
  return (
    React.createElement('div', {className:'flex flex-col text-sm'},
      React.createElement('div', null, 'Total: ', React.createElement('strong', null, `₹${totals.total}`)),
      React.createElement('div', null, 'Received: ', React.createElement('strong', null, `₹${totals.received}`)),
      React.createElement('div', null, 'Due: ', React.createElement('strong', {className: totals.due>0? 'text-amber-300' : 'text-green-300'}, `₹${totals.due}`))
    )
  );
}



export function ActionButtonsCell({onAddFee, onEditFee, onToggleInquiry, onViewPayments, onInquiryInfo, hasInquiry}){
  return (
    React.createElement('div', {className:'flex flex-wrap gap-2'},
      React.createElement('button', {onClick: onAddFee, className:'px-2 py-1 rounded-md text-sm bg-white/6'}, 'Add Fee'),
      React.createElement('button', {onClick: onEditFee, className:'px-2 py-1 rounded-md text-sm bg-white/6'}, 'Edit Fee'),
      React.createElement('button', {onClick: onToggleInquiry, className:'px-2 py-1 rounded-md text-sm bg-white/6'}, hasInquiry? 'Edit Inquiry':'Add Inquiry'),
      React.createElement('button', {onClick: onViewPayments, className:'px-2 py-1 rounded-md text-sm bg-white/6'}, 'Payment History'),
      React.createElement('button', {onClick: onInquiryInfo, className:'px-2 py-1 rounded-md text-sm bg-white/6'}, 'Inquiry Info')
    )
  );
}


export function TableHeader({columns, sortBy, sortDir, onSortToggle}){
  return (
    React.createElement('thead', null,
      React.createElement('tr', null,
        columns.filter(c=>c.visible).map(col=> (
          React.createElement('th', {key: col.key, className:'px-4 py-3 text-left cursor-pointer select-none', onClick: ()=> { if(col.sortable) onSortToggle(col.key); }},
            React.createElement('div', {className:'flex items-center gap-2'},
              React.createElement('span', {className:'font-medium'}, col.label),
              React.createElement('span', {className:'opacity-70 text-xs'}, sortBy===col.key ? (sortDir==='asc' ? '▲' : '▼') : '')
            )
          )
        )),
        React.createElement('th', {className:'px-4 py-3'}, 'Actions')
      )
    )
  );
}

import React from 'react';

export function StudentRow({student, columns, onOpenProfile, onAddFee, onEditFee, onToggleInquiry, onViewPayments, onInquiryInfo}){
  return (
    React.createElement('tr', {className:'odd:bg-white/3 even:bg-white/2/5 hover:bg-white/5 transition-colors'},
      columns.filter(c=>c.visible).map(col=>{
        if(col.key === 'fees'){
          return React.createElement('td', {key: col.key, className:'px-4 py-3'}, React.createElement(FeesCell, {fees: student.fees, payments: student.payments}));
        }
        if(col.key === 'studentName'){
          return React.createElement('td', {key: col.key, className:'px-4 py-3'}, React.createElement('button', {className:'underline text-indigo-200', onClick: ()=> onOpenProfile(student)}, student.studentName || '—'));
        }
        return React.createElement('td', {key: col.key, className:'px-4 py-3'}, student[col.key] || '—');
      }),
      React.createElement('td', {className:'px-4 py-3'}, React.createElement(ActionButtonsCell, {onAddFee: ()=> onAddFee(student), onEditFee: ()=> onEditFee(student), onToggleInquiry: ()=> onToggleInquiry(student), onViewPayments: ()=> onViewPayments(student), onInquiryInfo: ()=> onInquiryInfo(student), hasInquiry: false}))
    )
  );
}


export function SearchBar({onSearch, searchColumns, filtersActive, onClearFilters}){
  const [q, setQ] = useState('');
  const [col, setCol] = useState('All');
  const submit = (e)=>{ e?.preventDefault(); onSearch(q, col); };
  return (
    React.createElement('div', {className:'flex items-center gap-4'},
      React.createElement('form', {onSubmit: submit, className:'flex items-center gap-2'},
        React.createElement('input', {value: q, onChange: (e)=> setQ(e.target.value), placeholder:'Search...', className:'p-2 rounded-lg bg-white/5 border border-white/5'}),
        React.createElement('select', {value: col, onChange: (e)=> setCol(e.target.value), className:'p-2 rounded-lg bg-white/5 border border-white/5'},
          React.createElement('option', null, 'All'),
          searchColumns.map(sc=> React.createElement('option', {key: sc, value: sc}, sc))
        ),
        React.createElement('button', {type:'submit', className:'px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white'}, 'Search')
      ),
      filtersActive && React.createElement('div', {className:'ml-4 px-3 py-2 bg-red-800 text-white rounded-lg shadow-glow'},
        React.createElement('div', {className:'text-sm font-semibold'}, 'FILTERS ACTIVE — Search is limited to filtered results.'),
        React.createElement('button', {onClick: onClearFilters, className:'underline text-sm mt-1'}, 'Clear Filters')
      )
    )
  );
}


export function ColumnSelectorPanel({columns, open, onClose, onToggleColumn}){
  const panelRef = useRef();
  const [pos, setPos] = useState({x:100,y:100});
  const dragging = useRef(false);
  const offset = useRef({x:0,y:0});
  useEffect(()=>{
    const onMove = (e)=>{ if(dragging.current) setPos({x: e.clientX - offset.current.x, y: e.clientY - offset.current.y}); };
    const stop = ()=> dragging.current=false;
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', stop);
    return ()=>{ window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', stop); };
  },[]);

  if(!open) return null;
  return (
    React.createElement('div', {className:'fixed z-40', style:{left: pos.x, top: pos.y}},
      React.createElement('div', {className:'p-3 rounded-2xl bg-white/8 backdrop-blur-md border border-white/8 shadow-lg flex flex-col h-full', ref: panelRef},
        React.createElement('div', {className:'flex justify-between items-center mb-2 cursor-move', onMouseDown: (e)=>{ dragging.current=true; offset.current={x:e.clientX - pos.x, y:e.clientY - pos.y}; }},
          React.createElement('div', {className:'font-semibold'}, 'Customize Columns'),
          React.createElement('div', {className:'flex gap-2'}, React.createElement('button', {onClick: onClose, className:'px-2 py-1 rounded bg-white/5'}, 'Close'))
        ),
        React.createElement('div', {className:'overflow-auto flex-1'},
          columns.map(col=> (
            React.createElement('div', {key: col.key, className:'flex justify-between items-center p-2 rounded hover:bg-white/5'},
              React.createElement('div', null, col.label),
              React.createElement('label', {className:'inline-flex items-center'},
                React.createElement('input', {type:'checkbox', checked: col.visible, onChange: ()=> onToggleColumn(col.key), className:'mr-2'}),
                React.createElement('span', {className:'text-sm opacity-80'}, 'Show')
              )
            )
          ))
        )
      )
    )
  );
}

function getColumnType(col){
  const numCols = ['srNo'];
  const dateCols = ['dob','adDate','leftDate'];
  const enumCols = ['class','section'];
  if(numCols.includes(col)) return 'number';
  if(dateCols.includes(col)) return 'date';
  if(enumCols.includes(col)) return 'enum';
  return 'text';
}

export function FilterPanel({open, onClose, onApply, onClear, possibleValues}){
  const [blocks, setBlocks] = useState([]);
  const [pos, setPos] = useState({x:80,y:120});
  const dragging = useRef(false);
  const offset = useRef({x:0,y:0});
  useEffect(()=>{
    const onMove = (e)=>{ if(dragging.current) setPos({x: e.clientX - offset.current.x, y: e.clientY - offset.current.y}); };
    const stop = ()=> dragging.current=false;
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', stop);
    return ()=>{ window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', stop); };
  },[]);

  if(!open) return null;
  const addBlock = ()=> setBlocks(b=> [...b, {id:Date.now(), column:'studentName', type:'text', cond:'contains', value:''}]);
  const updateBlock = (id, patch)=> setBlocks(b=> b.map(x=> x.id===id? {...x,...patch}:x));
  const deleteBlock = (id)=> setBlocks(b=> b.filter(x=> x.id!==id));
  const reorder = (from, to)=>{
    setBlocks(prev=>{
      const arr = [...prev];
      if(from<0 || to<0 || from>=arr.length || to>=arr.length) return arr;
      const [item] = arr.splice(from,1);
      arr.splice(to,0,item);
      return arr;
    });
  };

  return (
    React.createElement('div', {className:'fixed z-50', style:{left: pos.x, top: pos.y}},
      React.createElement('div', {className:'w-[520px] rounded-2xl bg-white/8 backdrop-blur-md border border-white/8 p-4 shadow-xl'},
        React.createElement('div', {className:'flex justify-between items-center mb-3 cursor-move', onMouseDown: (e)=>{ dragging.current=true; offset.current={x:e.clientX - pos.x, y:e.clientY - pos.y}; }},
          React.createElement('div', {className:'font-semibold'}, 'Advanced Filters'),
          React.createElement('div', {className:'flex gap-2'}, React.createElement('button', {onClick: onClear, className:'px-2 py-1 rounded bg-white/5'}, 'Clear all'), React.createElement('button', {onClick: onClose, className:'px-2 py-1 rounded bg-white/5'}, 'Close'))
        ),
        React.createElement('div', {className:'space-y-3 max-h-[48vh] overflow-auto'},
          blocks.map((b, idx)=> (
            React.createElement('div', {key: b.id, className:'p-3 bg-white/5 rounded-lg'},
              React.createElement('div', {className:'flex items-center justify-between mb-2'},
                React.createElement('div', {className:'font-medium'}, `Filter #${idx+1}`),
                React.createElement('div', {className:'flex gap-2'},
                  React.createElement('button', {onClick: ()=> reorder(idx, Math.max(0, idx-1)), className:'px-2 py-1 rounded bg-white/5'}, '↑'),
                  React.createElement('button', {onClick: ()=> reorder(idx, Math.min(blocks.length-1, idx+1)), className:'px-2 py-1 rounded bg-white/5'}, '↓'),
                  React.createElement('button', {onClick: ()=> deleteBlock(b.id), className:'px-2 py-1 rounded bg-red-700 text-white'}, 'Delete')
                )
              ),
              React.createElement('div', {className:'grid grid-cols-3 gap-2'},
                React.createElement('select', {value: b.column, onChange: (e)=> { const col = e.target.value; updateBlock(b.id, {column:col, type:getColumnType(col), cond: 'contains', value: ''}); }, className:'p-2 rounded bg-white/5'},
                  React.createElement('option', {value:'studentName'}, 'studentName'),
                  React.createElement('option', {value:'fatherName'}, 'fatherName'),
                  React.createElement('option', {value:'class'}, 'class'),
                  React.createElement('option', {value:'section'}, 'section'),
                  React.createElement('option', {value:'srNo'}, 'srNo'),
                  React.createElement('option', {value:'aadhar'}, 'aadhar'),
                  React.createElement('option', {value:'dob'}, 'dob'),
                  React.createElement('option', {value:'adDate'}, 'adDate')
                ),
                React.createElement('select', {value: b.cond, onChange: (e)=> updateBlock(b.id, {cond: e.target.value}), className:'p-2 rounded bg-white/5'},
                  getColumnType(b.column) === 'text' ? React.createElement(React.Fragment, null,
                    React.createElement('option', {value:'contains'}, 'Contains'),
                    React.createElement('option', {value:'equals'}, 'Equals'),
                    React.createElement('option', {value:'starts'}, 'Starts With'),
                    React.createElement('option', {value:'ends'}, 'Ends With')
                  ) : getColumnType(b.column) === 'number' ? React.createElement(React.Fragment, null,
                    React.createElement('option', {value:'='}, '='),
                    React.createElement('option', {value:'>'}, '>'),
                    React.createElement('option', {value:'<'}, '<'),
                    React.createElement('option', {value:'between'}, 'Between')
                  ) : getColumnType(b.column) === 'date' ? React.createElement(React.Fragment, null,
                    React.createElement('option', {value:'before'}, 'Before'),
                    React.createElement('option', {value:'after'}, 'After'),
                    React.createElement('option', {value:'between'}, 'Between')
                  ) : React.createElement(React.Fragment, null,
                    React.createElement('option', {value:'in'}, 'In')
                  )
                ),
                React.createElement('div', null,
                  getColumnType(b.column) === 'enum' ? React.createElement('select', {multiple: true, value: b.value||[], onChange: (e)=>{ const opts = Array.from(e.target.selectedOptions).map(o=>o.value); updateBlock(b.id, {value: opts}); }, className:'p-2 rounded bg-white/5 w-full h-24'},
                    (possibleValues[b.column]||[]).map(v=> React.createElement('option', {key: v, value: v}, v))
                  ) : React.createElement('input', {value: b.value||'', onChange: (e)=> updateBlock(b.id, {value: e.target.value}), className:'p-2 rounded bg-white/5 w-full'})
                )
              )
            )
          ))
        ),
        React.createElement('div', {className:'mt-3 flex justify-between items-center'},
          React.createElement('button', {onClick: addBlock, className:'px-3 py-2 rounded bg-indigo-600 text-white'}, 'Add Filter'),
          React.createElement('div', {className:'flex gap-2'},
            React.createElement('button', {onClick: ()=> onApply(blocks), className:'px-3 py-2 rounded bg-green-600 text-white'}, 'Apply'),
            React.createElement('button', {onClick: onClear, className:'px-3 py-2 rounded bg-white/5'}, 'Clear')
          )
        )
      )
    )
  );
}


export function PaginationController({onLoadMore, rowsPerLoad, setRowsPerLoad, canLoadMore}){
  const sentinelRef = useRef();
  useEffect(()=>{
    if(rowsPerLoad === 'All') return;
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{ if(entry.isIntersecting && canLoadMore) onLoadMore(); });
    }, {root: null, rootMargin: '200px'});
    if(sentinelRef.current) obs.observe(sentinelRef.current);
    return ()=> obs.disconnect();
  }, [onLoadMore, canLoadMore, rowsPerLoad]);

  return (
    React.createElement('div', {className:'mt-4 flex justify-between items-center'},
      React.createElement('div', null,
        'Rows per load:',
        React.createElement('select', {value: rowsPerLoad, onChange: (e)=> setRowsPerLoad(e.target.value), className:'ml-2 p-2 rounded bg-white/5'},
          React.createElement('option', {value:20}, '20'),
          React.createElement('option', {value:50}, '50'),
          React.createElement('option', {value:100}, '100'),
          React.createElement('option', {value:'All'}, 'All')
        )
      ),
      React.createElement('div', null,
        React.createElement('div', {ref: sentinelRef, className:'h-6'}),
        canLoadMore ? React.createElement('div', {className:'text-sm opacity-80'}, 'Scroll to load more...') : React.createElement('div', {className:'text-sm opacity-80'}, 'All loaded')
      )
    )
  );
}

import {getMockStudents} from './mockStudents';

let ALL_STUDENTS = getMockStudents();

export function loadStudents(){
  console.log('[loadStudents] returning mock dataset size', ALL_STUDENTS.length);
  return Promise.resolve(ALL_STUDENTS.slice());
}

export function searchStudents(query, column, dataset){
  if(!query) return dataset.slice();
  const q = query.toString().trim().toLowerCase();
  const fields = column && column!=='All' ? [column] : ['studentName','fatherName','class','section','srNo','aadhar'];
  return dataset.filter(s=> fields.some(f=> ((s[f]||'') + '').toString().toLowerCase().includes(q)));
}

export function applyFilters(filterBlocks, dataset){
  if(!filterBlocks || filterBlocks.length===0) return dataset.slice();
  const check = (student, block)=>{
    const raw = student[block.column];
    const val = raw == null ? '' : (typeof raw === 'number' ? String(raw) : raw.toString());
    switch(block.cond){
      case 'contains': return val.toLowerCase().includes((block.value||'').toString().toLowerCase());
      case 'equals': return val.toLowerCase() === (block.value||'').toString().toLowerCase();
      case 'starts': return val.toLowerCase().startsWith((block.value||'').toString().toLowerCase());
      case 'ends': return val.toLowerCase().endsWith((block.value||'').toString().toLowerCase());
      case '>': return Number(val) > Number(block.value);
      case '<': return Number(val) < Number(block.value);
      case '=': return Number(val) === Number(block.value);
      case 'between': {
        const [a,b] = (block.value||'').toString().split(',').map(x=>x.trim());
        return Number(val) >= Number(a) && Number(val) <= Number(b);
      }
      case 'before': return new Date(val) < new Date(block.value);
      case 'after': return new Date(val) > new Date(block.value);
      case 'in': return (block.value||[]).includes(val);
      default: return true;
    }
  };
  return dataset.filter(s=> filterBlocks.every(b=> check(s,b)));
}

const DEFAULT_COLUMNS = [
  {key:'studentName', label:'Student Name', visible:true, sortable: true},
  {key:'fatherName', label:'Father Name', visible:true, sortable: true},
  {key:'class', label:'Class', visible:true, sortable: true},
  {key:'section', label:'Section', visible:true, sortable: true},
  {key:'srNo', label:'SR No', visible:true, sortable: true},
  {key:'aadhar', label:'Aadhar', visible:true, sortable: true},
  {key:'fees', label:'Fees Summary', visible:true, sortable: false},
];

export function StudentTable(){
  const [all, setAll] = useState([]);
  const [visibleCols, setVisibleCols] = useState(DEFAULT_COLUMNS);
  const [sortBy, setSortBy] = useState('srNo');
  const [sortDir, setSortDir] = useState('asc');
  const [query, setQuery] = useState('');
  const [queryCol, setQueryCol] = useState('All');
  const [filters, setFilters] = useState([]);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [colPanelOpen, setColPanelOpen] = useState(false);
  const [rowsPerLoad, setRowsPerLoad] = useState(20);
  const [loadedCount, setLoadedCount] = useState(0);
  const loadedCountRef = useRef(0);
  const [displayed, setDisplayed] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [canLoadMore, setCanLoadMore] = useState(true);

  useEffect(()=>{ loadStudents().then(data=>{ setAll(data); setDisplayed([]); setLoadedCount(0); loadedCountRef.current = 0; setCanLoadMore(true); }); }, []);

  const filtered = useMemo(()=> applyFilters(filters, all), [all, filters]);
  const searched = useMemo(()=> searchStudents(query, queryCol, filters.length? filtered : all), [query, queryCol, all, filtered, filters.length]);

  const sorted = useMemo(()=>{
    const arr = searched.slice();
    const key = sortBy;
    arr.sort((a,b)=>{
      const A = a[key] == null ? '' : (typeof a[key] === 'object' ? JSON.stringify(a[key]) : String(a[key]));
      const B = b[key] == null ? '' : (typeof b[key] === 'object' ? JSON.stringify(b[key]) : String(b[key]));
      const aa = A.toString().toLowerCase();
      const bb = B.toString().toLowerCase();
      if(aa<bb) return sortDir==='asc'? -1:1;
      if(aa>bb) return sortDir==='asc'? 1:-1;
      return 0;
    });
    return arr;
  }, [searched, sortBy, sortDir]);

  useEffect(()=>{ setDisplayed([]); setLoadedCount(0); loadedCountRef.current = 0; setCanLoadMore(true); }, [sorted]);

  const loadMore = useCallback(()=>{
    const per = rowsPerLoad === 'All' ? sorted.length : Number(rowsPerLoad);
    const start = loadedCountRef.current;
    const nextBatch = sorted.slice(start, start + per);
    if(nextBatch.length === 0){ setCanLoadMore(false); return; }
    setDisplayed(prev=> [...prev, ...nextBatch]);
    loadedCountRef.current = start + nextBatch.length;
    setLoadedCount(loadedCountRef.current);
    if(loadedCountRef.current >= sorted.length) setCanLoadMore(false);
  }, [rowsPerLoad, sorted]);

  useEffect(()=>{ loadMore(); }, [sorted, rowsPerLoad]);

  const toggleColumn = (key)=> setVisibleCols(cols=> cols.map(c=> c.key===key? {...c, visible: !c.visible} : c));
  const onSortToggle = (key)=>{ const col = visibleCols.find(c=> c.key===key); if(!col || col.sortable===false) return; if(sortBy===key) setSortDir(d=> d==='asc'?'desc':'asc'); else { setSortBy(key); setSortDir('asc'); }};

  const onSearch = (q, col)=>{ setQuery(q); setQueryCol(col); };
  const onClearFilters = ()=>{ setFilters([]); };

  const openProfile = (student)=>{ setSelectedStudent(student); setProfileOpen(true); };
  const onSaveProfile = (updated)=>{
    ALL_STUDENTS = ALL_STUDENTS.map(s=> s.srNo === updated.srNo ? {...s, ...updated} : s);
    setAll(ALL_STUDENTS.slice());
  };

  const possibleValues = useMemo(()=>({ class: Array.from(new Set(all.map(a=>a.class).filter(Boolean))), section: Array.from(new Set(all.map(a=>a.section).filter(Boolean))) }), [all]);

  return (
    React.createElement('div', {className:'min-h-screen p-8 bg-[linear-gradient(180deg,#0f172a,rgba(8,10,20,0.95))] text-white'},
      React.createElement('div', {className:'max-w-full mx-auto'},
        React.createElement('div', {className:'flex items-center justify-between mb-6'},
          React.createElement('h1', {className:'text-3xl font-bold'}, 'Student Management'),
          React.createElement('div', {className:'flex gap-3'},
            React.createElement('button', {onClick: ()=> setVisibleCols(prev=> prev.map(c=> c)), className:'px-3 py-2 rounded bg-white/6'}, 'Customize Columns'),
            React.createElement('button', {onClick: ()=> setFilterPanelOpen(true), className:'px-3 py-2 rounded bg-white/6'}, 'Filters')
          )
        ),

        React.createElement('div', {className:'p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/6 shadow-xl'},
          React.createElement('div', {className:'flex justify-between items-center mb-4'}, React.createElement(SearchBar, {onSearch, searchColumns:['studentName','fatherName','class','section','srNo','aadhar'], filtersActive: filters.length>0, onClearFilters})),

          React.createElement('div', {className:'overflow-auto rounded-xl'},
            React.createElement('table', {className:'w-full table-auto border-separate border-spacing-0'},
              React.createElement(TableHeader, {columns: visibleCols, sortBy, sortDir, onSortToggle}),
              React.createElement('tbody', null,
                displayed.map((s, i)=> React.createElement(StudentRow, {key: `${s.srNo}-${i}`, student: s, columns: visibleCols, onOpenProfile: openProfile, onAddFee: (st)=> console.log('Add fee', st.srNo), onEditFee: (st)=> console.log('Edit fee', st.srNo), onToggleInquiry: (st)=> console.log('Toggle inquiry', st.srNo), onViewPayments: (st)=> console.log('View payments', st.srNo), onInquiryInfo: (st)=> console.log('Inquiry info', st.srNo)}))
              )
            )
          ),

          React.createElement(PaginationController, {onLoadMore: loadMore, rowsPerLoad, setRowsPerLoad, canLoadMore})
        )
      ),

      React.createElement(ColumnSelectorPanel, {columns: visibleCols, open: colPanelOpen, onClose: ()=> setColPanelOpen(false), onToggleColumn: toggleColumn}),
      React.createElement(FilterPanel, {open: filterPanelOpen, onClose: ()=> setFilterPanelOpen(false), onApply: (blocks)=>{ setFilters(blocks); setFilterPanelOpen(false); }, onClear: ()=> setFilters([]), possibleValues}),
      React.createElement(StudentProfileModal, {student: selectedStudent, open: profileOpen, onClose: ()=> setProfileOpen(false), onSave: onSaveProfile})
    )
  );
}

export default StudentTable;
