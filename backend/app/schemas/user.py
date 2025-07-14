from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
## class UserCreate(BaseModel): 입력 데이터 검증
# 이 모델은 API를 통해 새로운 사용자를 생성할 때 클라이언트가 보내는 데이터의 형식을 정의하고 유효성을 검사하는 역할을 합니다.
# username: str, email: str, password: str
# 사용자를 생성하기 위해서는 이 세 가지 필드가 반드시 str(문자열) 타입으로 포함되어야 함을 강제합니다.
# 만약 클라이언트가 이 형식에 맞지 않는 데이터(예: username을 빼먹거나 password를 숫자로 보냄)를 보내면, Pydantic이 자동으로 422 (Unprocessable Entity) 에러를 발생시켜 잘못된 데이터가 시스템에 들어오는 것을 막아줍니다.
class UserRead(BaseModel):
    id: int
    username: str
    email: str
## class UserRead(BaseModel): 출력 데이터 형식 정의
# 이 모델은 데이터베이스에서 조회한 사용자 정보를 클라이언트에게 응답으로 보낼 때의 형식을 정의합니다.
# id: int, username: str, email: str
# 사용자 정보를 보여줄 때는 id, username, email 필드만 포함시킵니다.
# 가장 큰 특징은 보안을 위해 중요한 정보인 password 필드가 제외되었다는 점입니다. 이처럼 출력 모델을 따로 정의하면 민감한 정보가 실수로 외부에 노출되는 것을 방지할 수 있습니다.
    class Config:
        orm_mode = True
# class Config: 와 orm_mode = True
# 이 설정은 Pydantic이 ORM(객체 관계 매핑) 모델과 호환되도록 하는 매우 중요한 옵션입니다. (Pydantic V2에서는 from_attributes = True로 이름이 변경되었습니다.)
# SQLAlchemy 같은 ORM을 통해 조회한 데이터베이스 객체(예: db_user)를 UserRead.from_orm(db_user)처럼 한 줄로 간단하게 Pydantic 모델로 변환할 수 있게 해줍니다.
# 이 기능이 없으면, db_user.id, db_user.username 등 ORM 객체의 속성을 일일이 꺼내서 딕셔너리로 만든 후 Pydantic 모델로 변환해야 하는 번거로움이 있습니다. orm_mode는 이 과정을 자동화하여 코드의 가독성과 생산성을 크게 높여줍니다.