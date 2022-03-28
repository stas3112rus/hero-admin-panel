

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров
import {useHttp} from '../../hooks/http.hook';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { heroesFetching, updateHeroes, filtersFetching, filtersFetched, filtersFetchingError } from '../../actions';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../spinner/Spinner';


const HeroesAddForm = () => {

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [elem, setElem] = useState('');
   

    const {heroes, filters, filtersLoadingStatus} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();
    

    useEffect(()=>{
        dispatch(filtersFetching());

        request("http://localhost:3001/filters")
            .then(data => dispatch(filtersFetched(data)))            
            .catch(() => dispatch(filtersFetchingError()))

    },[])

    const getOptionsFilters = () => {

            return filters
                          .filter(item => item.type !=='all')
                          .map(
                                item =>
                                <option key={item.id} value={item.type}>
                                    {item.name}
                                </option>
                           )        
    }

   

    const getSelect = () => {
        switch (filtersLoadingStatus){
            case 'error':
                return (<h5>Фильтры не загружены</h5>)
            case 'loading':
                return <Spinner/>
            case 'idle':
                const optionsFilter = getOptionsFilters();
                return (
                    <select 
                        required
                        className="form-select" 
                        id="element" 
                        name="element"
                        value={elem}
                        onChange={(e)=>setElem(e.target.value)}
                        >
                        <option >Я владею элементом...</option>
                        {optionsFilter}
                    </select>
                    
                )    
            default: 
                console.log(filtersLoadingStatus)
        }
    }
    
    const select = getSelect();

    const onSubmit = ()=> {
        
       
        const newHero = {
            id: uuidv4(),
            name: name,
            description: desc,
            element: elem
        }

        setName('');
        setDesc('');
        setElem('');

        dispatch(heroesFetching());
        dispatch(updateHeroes([...heroes, newHero]));

        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
    }

    return (
        <Formik
            initialValues = {{
                name: '',
                text: '',
                element: '',
            }}
            validate={()=>{
                const errors ={}
                
                if (!name) {
                    errors.name = 'Имя не указано'
                }

                if (!desc) {
                    errors.text = 'Описание обязательно'
                }

                if (!elem){
                    errors.element = 'Не выбран Элемент'
                }

                return errors;
            }}
            onSubmit={()=>onSubmit()}
            className="border p-4 shadow-lg rounded"
            >
           <Form action="">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                    <Field 
                        required
                        type="text" 
                        name="name" 
                        className="form-control" 
                        id="name" 
                        placeholder="Как меня зовут?"
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        />
                    <ErrorMessage style={{'color': 'red'}} name='name' component={'h4'}/>
                </div>

                <div className="mb-3">
                    <label htmlFor="text" className="form-label fs-4">Описание</label>
                    <Field
                        as='textarea'
                        required
                        name="text" 
                        className="form-control" 
                        style={{"height": '130px'}}
                        id="text" 
                        placeholder="Что я умею?"                        
                        value={desc}
                        onChange={(e)=>setDesc(e.target.value)}
                        />
                    <ErrorMessage style={{'color': 'red'}} name='text' component={'h4'}/>

                </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                {select}
                <ErrorMessage style={{'color': 'red'}} name='element' component={'h4'}/>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
           </Form> 
        </Formik>
    )
}


export default HeroesAddForm;