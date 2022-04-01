import {useHttp} from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector  } from 'react-redux';
import { CSSTransition, TransitionGroup} from 'react-transition-group';


import { heroesFetching, heroesFetched, heroesFetchingError, updateHeroes } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import './heroesList.scss'
// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
    const {heroes, heroesLoadingStatus} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();
   
    useEffect(() => {
        dispatch(heroesFetching());
        request("http://localhost:3001/heroes")
            .then(data => dispatch(heroesFetched(data)))            
            .catch(() => dispatch(heroesFetchingError()))

        // eslint-disable-next-line
    }, []);   

    const deleteHero = (id) => {
        
        const newHeroes = heroes.filter(hero => hero.id !== id);
        dispatch(updateHeroes(newHeroes));
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
    }
    
    

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return arr.map(({id, ...props}) => {
            return (
                <CSSTransition timeout={1000} classNames="hero">
                    <HeroesListItem key={id} id={id} deleteHero={deleteHero} {...props}/>
                </CSSTransition>
                )
        })
    }

    const elements = renderHeroesList(heroes);
    return (
        <TransitionGroup component="ul">
            {elements}
        </TransitionGroup>
    )
}

export default HeroesList;