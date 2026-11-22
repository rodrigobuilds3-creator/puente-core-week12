let slide=0,caseIndex=0,exampleData=null;
const number=new Intl.NumberFormat('es-MX',{maximumFractionDigits:0});
const amount=value=>`MXN ${number.format(value)}`;

function renderCase(){
 if(!exampleData)return;
 const selected=exampleData.cases[caseIndex],result=selected.result;
 document.getElementById('case-margin').textContent=(result.margin>0?'+ ':'− ')+amount(Math.abs(result.margin));
 document.getElementById('case-state').textContent=result.margin<0?'No alcanza en este ejemplo':'Margen positivo; datos por confirmar';
 document.getElementById('case-equation').textContent=`${amount(selected.input.cash)} + ${amount(result.retainedIncome)} − ${amount(selected.input.transitionCosts)} − ${amount(result.protectedAmount)} = ${result.margin<0?'− ':''}${amount(Math.abs(result.margin))}`;
 document.getElementById('case-explanation').textContent=result.margin<0
  ?'La cuenta no cubre los gastos protegidos y los costos de transición. Puedes pedir información y conservar tu alternativa actual.'
  :'La cuenta deja un margen, pero no hay evidencia actual y confirmación humana de la ruta. El resultado sigue siendo provisional.';
}
document.querySelectorAll('input[name="case"]').forEach(el=>el.addEventListener('change',()=>{caseIndex=Number(el.value);renderCase();}));

const descriptions=[
 'Primera lámina: antes de aceptar, pregunta cuándo te pagarían.',
 'Segunda lámina: anota los gastos esenciales y los costos de empezar.',
 'Tercera lámina: el demo revisa 14 días y no confirma la fecha del primer pago.',
 'Cuarta lámina: puedes pedir información, corregir los datos o rechazar la oportunidad.'
];
function renderSlide(){
 const image=document.getElementById('carousel-image');
 image.src=`assets/c1-${slide+1}.png`;image.alt=descriptions[slide];
 document.getElementById('slide-label').textContent=`${slide+1} / 4`;
 document.getElementById('previous').disabled=slide===0;
 document.getElementById('next').disabled=slide===3;
}
document.getElementById('previous').addEventListener('click',()=>{slide=Math.max(0,slide-1);renderSlide();});
document.getElementById('next').addEventListener('click',()=>{slide=Math.min(3,slide+1);renderSlide();});

if(window.PUENTE_EXAMPLE&&Array.isArray(window.PUENTE_EXAMPLE.cases)&&window.PUENTE_EXAMPLE.cases.length===2){
 exampleData=window.PUENTE_EXAMPLE;renderCase();
}else{
 document.getElementById('case-state').textContent='No se pudo abrir el ejemplo';
 document.getElementById('case-margin').textContent='';
 document.getElementById('case-explanation').textContent='Consulta el PDF del ejercicio.';
}
