webpackJsonp([19],{668:function(e,t,r){"use strict";function n(e){return a.apply(this,arguments)}function a(){return a=A()(j.a.mark(function e(t){var r,n,a,s,c,u;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.offset,n=void 0===r?0:r,a=t.limit,s=void 0===a?10:a,c=S.a.get("access_token"),u=N,e.abrupt("return",Object(E.a)("".concat(G,"/order?offset=").concat(n,"&limit=").concat(s),{headers:{Authorization:c}}));case 4:case"end":return e.stop()}},e,this)})),a.apply(this,arguments)}function s(e){return c.apply(this,arguments)}function c(){return c=A()(j.a.mark(function e(t){var r,n,a;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.orderId,n=S.a.get("access_token"),a=N,e.abrupt("return",Object(E.a)("".concat(G,"/order/").concat(r,"?supplier_id=").concat(a),{headers:{Authorization:n}}));case 4:case"end":return e.stop()}},e,this)})),c.apply(this,arguments)}function u(e){return o.apply(this,arguments)}function o(){return o=A()(j.a.mark(function e(t){var r,n,a,s;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.orderId,n=t.status,a=S.a.get("access_token"),s=N,e.abrupt("return",Object(E.a)("".concat(G,"/order/").concat(r,"?supplier_id=").concat(s),{method:"put",headers:{Authorization:a},data:{status:n}}));case 4:case"end":return e.stop()}},e,this)})),o.apply(this,arguments)}function i(e){return p.apply(this,arguments)}function p(){return p=A()(j.a.mark(function e(t){var r,n,a,s,c;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.orderId,n=t.receiptId,a=t.images,s=t.remarks,c=S.a.get("access_token"),e.abrupt("return",Object(E.a)("".concat(M,"/receipt"),{method:"post",headers:{Authorization:c},data:{order_sn:r,receipt_sn:n,images:a,remarks:s}}));case 3:case"end":return e.stop()}},e,this)})),p.apply(this,arguments)}function d(e){return f.apply(this,arguments)}function f(){return f=A()(j.a.mark(function e(t){var r,n;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.data,n=S.a.get("access_token"),e.abrupt("return",Object(E.a)("".concat(M,"/logistics"),{method:"post",headers:{Authorization:n},data:D()({},r)}));case 3:case"end":return e.stop()}},e,this)})),f.apply(this,arguments)}function h(e){return l.apply(this,arguments)}function l(){return l=A()(j.a.mark(function e(t){var r,n,a,s;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.orderId,n=t.data,a=S.a.get("access_token"),s=N,e.abrupt("return",Object(E.a)("".concat(G,"/order/").concat(r,"?supplier_id=").concat(s),{method:"put",headers:{Authorization:a},data:D()({},n)}));case 4:case"end":return e.stop()}},e,this)})),l.apply(this,arguments)}function y(){return v.apply(this,arguments)}function v(){return v=A()(j.a.mark(function e(){var t,r;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=S.a.get("access_token"),r=N,e.abrupt("return",Object(E.a)("".concat(G,"/order?supplier_id=").concat(r,"&is_type=1"),{method:"get",headers:{Authorization:t}}));case 3:case"end":return e.stop()}},e,this)})),v.apply(this,arguments)}function x(e){return k.apply(this,arguments)}function k(){return k=A()(j.a.mark(function e(t){var r,n,a;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.orderId,n=S.a.get("access_token"),a=N,e.abrupt("return",Object(E.a)("".concat(G,"/order/").concat(r,"?supplier_id=").concat(a,"&is_type=1"),{method:"get",headers:{Authorization:n}}));case 4:case"end":return e.stop()}},e,this)})),k.apply(this,arguments)}function m(){return w.apply(this,arguments)}function w(){return w=A()(j.a.mark(function e(){var t,r;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=S.a.get("access_token"),r=N,e.abrupt("return",Object(E.a)("".concat(G,"/order?supplier_id=").concat(r,"&is_type=2"),{method:"get",headers:{Authorization:t}}));case 3:case"end":return e.stop()}},e,this)})),w.apply(this,arguments)}function b(e){return I.apply(this,arguments)}function I(){return I=A()(j.a.mark(function e(t){var r,n,a;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.orderId,n=S.a.get("access_token"),a=N,e.abrupt("return",Object(E.a)("".concat(G,"/order/").concat(r,"?supplier_id=").concat(a,"&is_type=2"),{method:"get",headers:{Authorization:n}}));case 4:case"end":return e.stop()}},e,this)})),I.apply(this,arguments)}function g(e){return _.apply(this,arguments)}function _(){return _=A()(j.a.mark(function e(t){var r,n,a,s;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.orderId,n=t.status,a=S.a.get("access_token"),s=N,e.abrupt("return",Object(E.a)("".concat(G,"/order/").concat(r,"?supplier_id=").concat(s),{method:"put",headers:{Authorization:a},data:{status:n}}));case 4:case"end":return e.stop()}},e,this)})),_.apply(this,arguments)}Object.defineProperty(t,"__esModule",{value:!0});var R=r(42),D=r.n(R),O=r(93),j=r.n(O),z=r(189),A=r.n(z),J=r(124),S=r.n(J),C=r(94),E=r(314),G="".concat(C.e,"/v1/supplier"),M="".concat(C.e,"/v1/order"),N=S.a.getJSON("userinfo").id;t.default={namespace:"orders",state:{list:[],detail:{},returns:[],refunds:[],returnDetail:{},refundDetail:{},total:0},effects:{fetch:j.a.mark(function e(t,r){var a,s,c,u,o,i,p,d,f;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=t.offset,s=t.limit,c=t.supplierId,u=t.success,o=t.error,i=r.call,p=r.put,e.next=4,i(n,{supplierId:c,offset:a,limit:s});case 4:if(d=e.sent,d.rescode>>0!==C.g){e.next=9;break}"function"==typeof u&&u(d),e.next=12;break;case 9:if("function"!=typeof o){e.next=12;break}return o(d),e.abrupt("return");case 12:return f=d.headers,e.next=15,p({type:"save",payload:d.data,headers:f});case 15:case"end":return e.stop()}},e,this)}),fetchDetail:j.a.mark(function e(t,r){var n,a,c,u,o,i,p;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.orderId,a=t.supplierId,c=t.success,u=t.error,o=r.call,i=r.put,e.next=4,o(s,{orderId:n,supplierId:a});case 4:if(p=e.sent,p.rescode>>0!==C.g){e.next=9;break}"function"==typeof c&&c(p),e.next=12;break;case 9:if("function"!=typeof u){e.next=12;break}return u(p),e.abrupt("return");case 12:return e.next=14,i({type:"saveDetail",payload:p.data});case 14:case"end":return e.stop()}},e,this)}),modifyStatus:j.a.mark(function e(t,r){var a,s,c,o,i,p,d,f,h,l;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=t.orderId,s=t.supplierId,c=t.status,o=t.success,i=t.error,p=r.call,d=r.put,e.next=4,p(u,{orderId:a,supplierId:s,status:c});case 4:if(f=e.sent,f.rescode>>0!==C.g){e.next=9;break}"function"==typeof o&&o(f),e.next=12;break;case 9:if("function"!=typeof i){e.next=12;break}return i(f),e.abrupt("return");case 12:return e.next=14,p(n,{supplierId:s});case 14:return h=e.sent,l=h.headers,e.next=18,d({type:"save",payload:h.data,headers:l});case 18:case"end":return e.stop()}},e,this)}),fetchOpenReceipt:j.a.mark(function e(t,r){var a,s,c,u,o,p,d,f,h,l,y;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=t.orderId,s=t.receiptId,c=t.images,u=t.remarks,o=t.success,p=t.error,d=r.call,f=r.put,e.next=4,d(i,{orderId:a,receiptId:s,images:c,remarks:u});case 4:return h=e.sent,h.rescode>>0===C.g?"function"==typeof o&&o(h):"function"==typeof p&&p(h),e.next=8,d(n,{});case 8:return l=e.sent,y=l.headers,e.next=12,f({type:"save",payload:l.data,headers:y});case 12:case"end":return e.stop()}},e,this)}),fetchDeliveryGoods:j.a.mark(function e(t,r){var a,s,c,u,o,i,p,f;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=t.data,s=t.success,c=t.error,u=r.call,o=r.put,e.next=4,u(d,{data:a});case 4:return i=e.sent,i.rescode>>0===C.g?"function"==typeof s&&s(i):"function"==typeof c&&c(i),e.next=8,u(n,{});case 8:return p=e.sent,f=p.headers,e.next=12,o({type:"save",payload:p.data,headers:f});case 12:case"end":return e.stop()}},e,this)}),fetchException:j.a.mark(function e(t,r){var a,s,c,u,o,i,p,d,f,l;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=t.orderId,s=t.supplierId,c=t.data,u=t.success,o=t.error,i=r.call,p=r.put,e.next=4,i(h,{orderId:a,supplierId:s,data:c});case 4:return d=e.sent,d.rescode>>0===C.g?"function"==typeof u&&u(d):"function"==typeof o&&o(d),e.next=8,i(n,{});case 8:return f=e.sent,l=f.headers,e.next=12,p({type:"save",payload:f.data,headers:l});case 12:case"end":return e.stop()}},e,this)}),fetchReturns:j.a.mark(function e(t,r){var n,a,s,c,u;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.success,a=t.error,s=r.call,c=r.put,e.next=4,s(y);case 4:return u=e.sent,u.rescode>>0===C.g?"function"==typeof n&&n(u):"function"==typeof a&&a(u),e.next=8,c({type:"saveReturns",payload:u.data});case 8:case"end":return e.stop()}},e,this)}),fetchRefunds:j.a.mark(function e(t,r){var n,a,s,c,u;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.success,a=t.error,s=r.call,c=r.put,e.next=4,s(m);case 4:return u=e.sent,u.rescode>>0===C.g?"function"==typeof n&&n(u):"function"==typeof a&&a(u),e.next=8,c({type:"saveRefunds",payload:u.data});case 8:case"end":return e.stop()}},e,this)}),fetchConfirmReturn:j.a.mark(function e(t,r){var n,a,s,c,u,o,i,p;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.orderId,a=t.status,s=t.success,c=t.error,u=r.call,o=r.put,e.next=4,u(g,{orderId:n,status:a});case 4:return i=e.sent,i.rescode>>0===C.g?"function"==typeof s&&s(i):"function"==typeof c&&c(i),e.next=8,u(y);case 8:return p=e.sent,e.next=11,o({type:"saveReturns",payload:p.data});case 11:case"end":return e.stop()}},e,this)}),fetchReturnDetail:j.a.mark(function e(t,r){var n,a,s,c,u,o;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.orderId,a=t.success,s=t.error,c=r.call,u=r.put,e.next=4,c(x,{orderId:n});case 4:return o=e.sent,o.rescode>>0===C.g?"function"==typeof a&&a(o):"function"==typeof s&&s(o),e.next=8,u({type:"saveReturnDetail",payload:o.data});case 8:case"end":return e.stop()}},e,this)}),fetchRefundDetail:j.a.mark(function e(t,r){var n,a,s,c,u,o;return j.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.orderId,a=t.success,s=t.error,c=r.call,u=r.put,e.next=4,c(b,{orderId:n});case 4:return o=e.sent,o.rescode>>0===C.g?"function"==typeof a&&a(o):"function"==typeof s&&s(o),e.next=8,u({type:"saveRefundDetail",payload:o.data});case 8:case"end":return e.stop()}},e,this)})},reducers:{save:function(e,t){return D()({},e,{list:t.payload,total:t.headers["x-content-total"]>>0})},saveDetail:function(e,t){return D()({},e,{detail:t.payload})},saveReturns:function(e,t){return D()({},e,{returns:t.payload})},saveRefunds:function(e,t){return D()({},e,{refunds:t.payload})},saveReturnDetail:function(e,t){return D()({},e,{returnDetail:t.payload})},saveRefundDetail:function(e,t){return D()({},e,{refundDetail:t.payload})}}}}});