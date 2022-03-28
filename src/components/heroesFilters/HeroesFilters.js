// CSS Transition group - для анимации


// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active // ClassNames
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом
import {useHttp} from '../../hooks/http.hook';
import { useDispatch, useSelector } from 'react-redux';
import {heroesFetching, updateHeroes} from '../../actions';
import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner';


const HeroesFilters = () => {

    const [active, setActive] = useState('all');
    const {filters, filtersLoadingStatus} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(()=>{
        dispatch(heroesFetching());
        request("http://localhost:3001/heroes")
        .then(data=>data.filter(item=> {
            if (active ==='all') return item
            return item.element === active
        }))
        .then(data=>dispatch(updateHeroes(data)))
    },[active])
    
    
    const getFiltersButton = () => {

        return filters.map(
            item =>
                {                              
                    return (
                        <button 
                            key={item.id} 
                            className={(item.type===active) ?  item.styles + ' active' : item.styles}
                            onClick={()=>setActive(item.type)}
                            >
                            {item.name}
                        </button>)
                }
        )        
    }

    const getFilter = () => {
        switch (filtersLoadingStatus){
            case 'error':
                return (<h5>Фильтры не загружены</h5>)
            case 'loading':
                return <Spinner/>
            case 'idle':
                return getFiltersButton();       
            default: 
                console.log(filtersLoadingStatus)
        }
    }

    const filterButtons = getFilter();


    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                     {filterButtons}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;