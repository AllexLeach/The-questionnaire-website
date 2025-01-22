const sel = document.querySelector('.form_user__fio');
let fio

sel.addEventListener("change", e => {
   Array.from(e.target.options).forEach(el => {
      if (el.selected) {
         fio = el.value;
      }
   });
});

function xmhttp_onload_output_text(answers) {
   let ans_output = [];
   let str_ans = '';

   let ans_input = answers.split(';');
   ans_input.pop();

   ans_input.forEach((value, key) => {
      let arr = value.split('|');
      let str = arr.pop();
      let stringi = '';
      arr_ans = str.split('/');
      arr.push(arr_ans);

      for (i=0; i<arr_ans.length; i++) {
         stringi += `
         <div id="answer_${i+1}" class="answer">
            <label for="${key+1}">${arr_ans[i]}</label>
            <input type="radio" name="${key+1}" value="${arr_ans[i]}" class="input_answer_${i+1}">
         </div>`;
      }

      ans_output[key] = `
      <div id="question_${key+1}" class="question">
         <h2>Вопрос ${arr[0]}</h2>
         <h3>${arr[1]}</h3>
         <div class="answers">${stringi}</div>
         <button type="button" id="button_question_${key+1}" class="button_question"><img src="https://cdn-icons-png.flaticon.com/512/271/271226.png"></button>
      </div>`;
   });

   ans_output.forEach(element => {
      str_ans += element;
   });

   return `
   <form action="" method="post" class="question_form">
      ${str_ans}
      <input type="button" name="submit_ans" value="Отправить ответ" class="submit_ans">
   </form>`;
}

function post_data_answers() {
   const a = document.querySelector('.question_form');
   let arr = [];
   let str = '';

   for (i=0; i<a.length; i++) {
      arr.push(a[i]);
   }
   arr.pop();

   arr.forEach(el => {
      if (el.checked) {
         str += `${el.name}/${el.value};`;
      }
   });

   return str;
}

function tracking_answer__label_input() {
   const a = document.querySelectorAll(".question");
   a.forEach(el => {
      el.querySelectorAll(".answer").forEach(e => {
         e.firstElementChild.onclick = () => {
            e.lastElementChild.checked = true;
         }
      });
   });
}

function validate_form_user(fio, age) {
   if (!(fio || age)) {
      console.error("fio|age");
      const fioDom = document.querySelector(".form_user__fio");
      const ageDom = document.querySelector(".form_user__age");

      fioDom.style.border = "2px solid red";
      ageDom.style.border = "2px solid red";
      
      fioDom.onclick = () => {
         fioDom.style.border = "none";
         ageDom.style.border = "none";
      }
      ageDom.onclick = () => {
         fioDom.style.border = "none";
         ageDom.style.border = "none";
      }
   } else if (fio) {
      console.error("age");
      const ageDom = document.querySelector(".form_user__age");

      ageDom.style.border = "2px solid red";

      ageDom.onclick = () => {
         ageDom.style.border = "none";
      }
   } else {
      console.error("fio");
      const fioDom = document.querySelector(".form_user__fio");

      fioDom.style.border = "2px solid red";

      fioDom.onclick = () => {
         fioDom.style.border = "none";
      }
   }
}

function is_valid(el) {
   let valid = false;

   el.querySelectorAll('.answer').forEach((e, key) => {
      if (e.lastElementChild.checked) {
         valid = true;
      }
   });

   return valid;
}

function render_question(fio, strUsers) {
   const qf = document.querySelector('.question_form');
   let q_array = [];
   let q_object = {};

   qf.childNodes.forEach((el, key) => {
      if (key%2 != 0) {
         q_array.push(el);
      }
   });

   q_array[q_array.length-2].lastElementChild.remove();

   for (i=0; i<q_array.length-2; i++) {
      q_object[i] = [q_array[i], q_array[i].lastElementChild];
   }
   
   q_object[q_array.length-2] = [q_array[q_array.length-2], q_array[q_array.length-1]];
   
   for (let key in q_object) {

      if (key > 0) {
         q_object[key][0].style.display = "none";
         q_object[key][q_object[key].length-1].style.display = "none";
      }

      q_object[key][q_object[key].length-1].onclick = () => {
         if (is_valid(q_object[key][0])) {
            if (key == Object.keys(q_object).length-1) {
               // отправка данных юзера в бд (1 форма)
               const xuhttp = new XMLHttpRequest();
               xuhttp.open("GET", "./php/user.php?q=" + strUsers, true);
               xuhttp.send();

               // отправка ответов в бд (форма 2)
               const xhttp = new XMLHttpRequest();
               let str = post_data_answers() + '|' + fio;
               xhttp.open("POST", "./php/answer.php?q=" + str, true);
               xhttp.send();

               thenk_u();
               setTimeout(view_result, 100);
            } else {
               q_object[key][0].style.display = "none";
               q_object[key][q_object[key].length-1].style.display = "none";
   
               q_object[parseInt(key)+1][0].style.display = "flex";
               q_object[parseInt(key)+1][q_object[key].length-1].style.display = "flex";
            }
         } else {
            q_object[key][0].childNodes[3].style.border = "1px solid red";

            q_object[key][0].querySelectorAll('.answer').forEach((el) => {
               el.firstElementChild.onclick = () => {
                  q_object[key][0].childNodes[3].style.border = "none";
                  el.lastElementChild.checked = true;
               }
            });
         }
      }
   }
}

function animation_based_on_screen() {
   const screen_widths = ['435', '768', '1024', '1440', '40000'];
   for (i=0; i<screen_widths.length; i++) {
      if (document.body.clientWidth <= parseInt(screen_widths[i])) {
         return `_${screen_widths[i]}`;
      }
   }
}

function animation_user_form(uf) {
   uf.animationName = `user_form${animation_based_on_screen()}`;
   uf.animationDuration = "1s";
   uf.animationIterationCount = 1;
   uf.animationTimingFunction = "ease-in";
   uf.animationFillMode = "both";
}

function animation_question_form(qf) {
   qf.animationName = `question_form${animation_based_on_screen()}`;
   qf.animationDuration = "1s";
   qf.animationIterationCount = 1;
   qf.animationTimingFunction = "ease-in";
   qf.animationFillMode = "both";
}

function animation_box_go_out(go_out) {
   document.querySelector('.form_user').style.display = "none";
   go_out.animationName = `box_out${animation_based_on_screen()}`;
   go_out.animationDuration = "1s";
   go_out.animationIterationCount = 1;
   go_out.animationTimingFunction = "ease-in";
   go_out.animationFillMode = "both";
}

function thenk_u() {
   animation_box_go_out(document.querySelector(".box").style)
   document.querySelector(".block_form").innerHTML += `
      <div class="thenk_u">
         <h2>Спасибо огромное за прохождение теста!!!</h2>
         <h2>Каждый Ваш ответ важен для нас!</h2>
      </div>
   `
   animation_question_form(document.querySelector(".thenk_u").style);
}

function scroll_animation() {
   const phrase = document.querySelectorAll('.phrase');
   let phraseFirstPosition = [];
   for (i=0; i<phrase.length; i++) {
      phraseFirstPosition[i] = phrase[i].getBoundingClientRect().bottom;
   }

   document.body.addEventListener('scroll', function () {
      const form = document.querySelector('.form_user');
      const formPosition = form.getBoundingClientRect().top;
      let phrasePosition = [];

      for (i=0; i<phrase.length; i++) {
         phrasePosition[i] = phrase[i].getBoundingClientRect().bottom;
      }

      for (i=0; i<phrasePosition.length; i++) {
         if (phrasePosition[i] <= document.body.clientHeight/4 /*phraseFirstPosition[i]-40*/) {
            if (phrasePosition[i] <= 0) {
               phrase[i].style.opacity = 0;
            } else {
               phrase[i].style.opacity = phrasePosition[i]/phraseFirstPosition[i];
            }
         } else {
            phrase[i].style.opacity = 1;
         }
      }
   });
}

function decode_answer_view(ajax_ans) {
   let ajax_ans_object = {};
   let ajax_ans_array = ajax_ans.split(';');
   let unique_fio = [];
   let new_ajax_ans_array = [];
   ajax_ans_array.pop();

   for (i=0; i<ajax_ans_array.length-1; i++) {
      if (ajax_ans_array[i].split('|')[0] != ajax_ans_array[i+1].split('|')[0]) {
         unique_fio.push(ajax_ans_array[i].split('|')[0]);
      }
      new_ajax_ans_array[i] = ajax_ans_array[i].split('|');
   }
   new_ajax_ans_array[ajax_ans_array.length-1] = ajax_ans_array[ajax_ans_array.length-1].split('|');

   unique_fio.forEach(fio => {
      let object_to_fio = {};
      new_ajax_ans_array.forEach(el => {
         if (el[0] == fio) {
            object_to_fio[el[1].split('/')[0]] = el[1].split('/')[1];
         }
      });
      ajax_ans_object[fio] = object_to_fio;
   });

   return ajax_ans_object;

}

function count_answers(str) {
   let count_question_object = {};
   let arr = str.split(";");

   arr.pop();
   arr.forEach(el => {
      let num_arr = el.split('|')
      count_question_object[num_arr[0]] = num_arr[num_arr.length-1].split('/');
   });

   return count_question_object;
}

function render_ul(arr, object_ans, index) {
   let str = '';
   let arr_ans = [];
   let arr_ans_current = [];
   let procent = 0;

   for (let key in object_ans) {
      arr_ans.push(object_ans[key]);
   }

   arr_ans.forEach(el => {
      arr_ans_current.push(el[index]);
   });

   arr.forEach(el => {
      procent = (100*arr_ans_current.filter(x => x === el).length/arr_ans_current.length).toFixed(2);
      str += "<li>" + `<div class="answer_procent" id="${index}_'${el}'"><h3>${el}</h3><h3>${procent}%</h3></div>` + `<div class="answer_procent_hint"></div>` + "</li>";
   });

   return str;
}

function render_li(number_of_answer, answer_object) {
   let str = '';

   for (let key in number_of_answer) {
      str += "<li>" + `<ul class="list_answer">${render_ul(number_of_answer[key], answer_object, key)}</ul>` + "</li>";
   }

   return str;
}

function view_users(str) {
   let user_object = {
      'младше 18 лет': [],
      '18-24 года': [],
      '25-34 года': [],
      '35-44 года': [],
      '45-54 года': [],
      '55 лет и старше': []
   };
   let user_arr = str.split(";");
   user_arr.pop();

   user_arr.forEach(el => {
      const user_age = el.split("/").pop();
      if (user_age < 18) {
         user_object['младше 18 лет'].push(user_age);
      } else if (18 <= user_age && user_age <= 24) {
         user_object['18-24 года'].push(user_age);
      } else if (25 <= user_age && user_age <= 34) {
         user_object['25-34 года'].push(user_age);
      } else if (35 <= user_age && user_age <= 44) {
         user_object['35-44 года'].push(user_age);
      } else if (45 <= user_age && user_age <= 54) {
         user_object['45-54 года'].push(user_age);
      } else if (55 <= user_age) {
         user_object['55 лет и старше'].push(user_age);
      }
   });

   return user_object;
}

function graf(users) {
   google.charts.load('current', {'packages':['corechart']});
   google.charts.setOnLoadCallback(drawChart);
   function drawChart() {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Age');
      data.addColumn('number', 'People');
      data.addRows([
         ['младше 18 лет', users['младше 18 лет'].length],
         ['18-24 года', users['18-24 года'].length],
         ['25-34 года', users['25-34 года'].length],
         ['35-44 года', users['35-44 года'].length],
         ['45-54 года', users['45-54 года'].length],
         ['55 лет и старше', users['55 лет и старше'].length],          
      ]);
      var options = {
         // slices: { 
         //    1: {offset: 0.2}
         // },
         pieStartAngle: 45,
         legend: {
            textStyle: {color: '#000'},
            alignment: "center",
         }, 
         backgroundColor: "transparent",
         chartArea: {
            width: '90%', 
            height: '90%'
         },
         width: (document.body.clientWidth >= 650) ? 700: 350,
         height: 250,
         // colors: ['#3379b7', '#4f93ce', '#87b5de', '#0063ba', '#357fbf', '#23547f'],
         is3D: true
      };
      var chart = new google.visualization.PieChart(document.getElementById('chart'));
      chart.draw(data, options);
   }
}

// web-версия (надо написать проверку на web-браузер при использовании)
function question_res_hover(answers) {
   const answer_procent = document.querySelectorAll('.answer_procent');
   const hints = document.querySelectorAll('.answer_procent_hint');
   let arr_ans = [];
   let object_ans = [];

   for (let key in answers) {
      arr_ans.push(answers[key]);
   }

   for (let key in arr_ans[0]) {
      object_ans[key] = [];
   }
   
   arr_ans.forEach(el => {
      for (let key in el) {
         object_ans[key].push(el[key]);
      }
   });


   answer_procent.forEach((el, key) => {

      hints[key].innerHTML = `<p>Ответили:</p><p style="padding: 0 0 1.5vh 0"><em>${object_ans[el.id.split("_")[0]].filter(x => x === el.id.split("_")[1].slice(1, el.id.split("_")[1].length-1)).length}</em> человек</p>`;

      el.addEventListener('mousemove', (e) => {
         const position = {
            x: e.clientX,
            y: document.body.clientHeight - el.getBoundingClientRect().bottom + el.clientHeight - 5
         }


         
         hints[key].onmouseover = () => {
            hints[key].style.opacity = 1;
            hints[key].style.left = `${position.x}px`;
            hints[key].style.bottom = `${position.y}px`;
         }

         hints[key].onmouseout = () => {
            hints[key].style.opacity = 0;
            hints[key].style.left = "0";
            hints[key].style.bottom = "0";
         }



         hints[key].style.opacity = 1;
         hints[key].style.left = `${position.x}px`;
         hints[key].style.bottom = `${position.y}px`;
      });

      el.onmouseout = () => {
         hints[key].style.opacity = 0;
         hints[key].style.left = "0";
         hints[key].style.bottom = "0";
      }
   });
}

function view_result() {
   const xhttp = new XMLHttpRequest();
   xhttp.onload = function () {
      const block_output_result = document.querySelector('.result');
      const answer_object = decode_answer_view(this.responseText);
      const number_of_users = Object.keys(answer_object).length;
      let number_of_answer;

      if (number_of_users > 30) {
         block_output_result.innerHTML = `<h2>Количество опрошенных: ${number_of_users}</h2>`;

         const xmlhttp = new XMLHttpRequest();
         xmlhttp.onload = () => {
            number_of_answer = count_answers(xmlhttp.responseText);
            // console.log(answer_object, number_of_answer);

            block_output_result.innerHTML += `
            <div class="result_question">
               <h2>Вопросы:</h2>
               <ol class="list_question">
                  ${render_li(number_of_answer, answer_object)}
               </ol>
               <h2>Возрастные группы:</h2>
               <div id="chart"></div>
            </div>
            `
            question_res_hover(answer_object);


            const xmlhttpreq = new XMLHttpRequest();
            xmlhttpreq.onload = () => {
               const user_sort_by_age_object = view_users(xmlhttpreq.responseText);
               graf(user_sort_by_age_object);
            }
            xmlhttpreq.open("GET", "./php/view_users.php", true);
            xmlhttpreq.send();


         }
         xmlhttp.open("GET", "./php/questions.php", true);
         xmlhttp.send();
      }
   }
   xhttp.open("GET", "./php/view.php", true);
   xhttp.send();
}

document.querySelector('.form_user__submit').onclick = () => {
   const age = document.querySelector('.form_user__age').value;
   let id = '';
   
   if (fio && age) {
      let str = '' + fio.toString() + "/" + age.toString();

      const user_xhttp = new XMLHttpRequest();
      user_xhttp.onload = function() {
         id = user_xhttp.responseText;
      }
      user_xhttp.open("GET", "./php/get_user_id.php", true);
      user_xhttp.send();
      
      // получение вопросов с бд
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.onload = function() {
         document.querySelector('.box').innerHTML = xmhttp_onload_output_text(this.responseText);
         setTimeout(function() {
            let arr_id = id.split(';');
            arr_id.pop();
            i = (parseInt(arr_id.pop()) + 1).toString();

            render_question(i, str);
         }, 100);
      }
      xmlhttp.open("GET", "./php/questions.php", true);
      xmlhttp.send();
      
      setTimeout(function () {
         tracking_answer__label_input();
      }, 100)
   
      animation_user_form(document.querySelector(".form_user").style);
      animation_question_form(document.querySelector(".box").style);
   } else {
      validate_form_user(fio, age);
   }
};

view_result();

scroll_animation();