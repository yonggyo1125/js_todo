/**
 * 할일 등록, 수정, 삭제, 조회 기능
 * 
 */
const todo = {
    items: [], // 할일 목록 
    tpl: null, // 템플릿
    // 할일 조회
    get(uid) {
        const items = this.items.filter(item => item.uid === uid)
        return items?.length > 0 ? items[0] : null;
    },
    // 할일 등록 
    add(date, title, content) {
    
        this.items.push({
            uid: Date.now(),
            date,
            title,
            content
        });
   
        this.save();

        // 할일 등록 후 화면 갱신
        this.render();

        // 양식 초기화
        frmTodo.date.value = "";
        frmTodo.title.value = "";
        frmTodo.content.value = "";
    },
    // 할일 제거
    remove(uid) {
        for (let i = 0; i < this.items.length; i++) {
            console.log(this.items[i].uid, uid);
            if (this.items[i].uid === Number(uid)) {
                this.items.splice(i, 1);
            }
        }

        // 할일 저장
        this.save();

        // 할일 등록 후 화면 갱신
        this.render();
    },
    // 할일 저장
    save() {
        localStorage.setItem("todos", JSON.stringify(this.items));
    },
    // Todo 템플릿 조회
    getTpl() {
        // 템플릿은 구성이 동일하므로 최초 조회시 한번만 가져오도록 구성
        if (!this.tpl) {
            this.tpl = document.getElementById("tpl-item").innerHTML;
        }

        return this.tpl;
    },
    // 화면 갱신
    render() {
        // 저장된 할일 목록 조회
        this.items = localStorage.getItem("todos");
        this.items = typeof this.items === 'string' ? JSON.parse(this.items) : [];
        const targetEl = document.getElementById("todo-items");

        if (this.items?.length === 0) {
            return;
        }

        let html = "";
        for (const {uid, title, content, date} of this.items) {
            let tpl = this.getTpl();
            tpl = tpl.replace(/\$\{title\}/g, title)
                        .replace(/\$\{content\}/g, content)
                        .replace(/\$\{date\}/g, date)
                        .replace(/\$\{uid\}/g, uid);
            html += tpl;
        }
      
        targetEl.innerHTML = html;

        // 삭제, 수정 이벤트 바인딩
        const removeAction = (e) => {
            if (!confirm('정말 삭제하겠습니까?')) return;

            const el = e.currentTarget;
            const { uid } = el.dataset;
            this.remove(uid);
        };
        const deleteActions = document.getElementsByClassName("delete-action");
        for (const action of deleteActions) {
            action.removeEventListener("click", removeAction);
            action.addEventListener("click", removeAction);

        }

        
    }
};

window.addEventListener("DOMContentLoaded", function() {
    // 최초 화면 출력
    todo.render();

    // 양식 제출 처리 
    frmTodo.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const requiredFields = {
            date: "날짜를 선택하세요.",
            title: "제목을 입력하세요.",
            content: "내용을 입력하세요."
        };

        try {
            for (const [key, msg] of Object.entries(requiredFields)) {

                if (!frmTodo[key]?.value?.trim()) {
                    console.log(frmTodo[key].value)
                    throw new Error(msg); 
                }
            }

            todo.add(
                frmTodo.date.value,
                frmTodo.title.value.trim(),
                frmTodo.content.value.trim()
            );

        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    });
});