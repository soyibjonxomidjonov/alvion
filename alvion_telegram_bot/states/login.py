from aiogram.dispatcher.filters.state import State, StatesGroup



class LoginState(StatesGroup):
    full_name = State()
    phone_number = State()
    age = State()
    address = State()
    english_level = State()
    time_convenience = State()
    comment = State()