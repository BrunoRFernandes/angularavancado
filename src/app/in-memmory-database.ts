import { InMemoryDbService } from "angular-in-memory-web-api";
import { Category } from "./pages/categories/shared/category.model";

export class InMemoryDataBase implements InMemoryDbService{
    createDb(){
        const categories: Category[] = [
            {id: 1, name: "Lazer", description: "Cinema, Teatro, Futebol"},
            {id: 2, name: "Moradia", description: "Luz, Agua, Internet"},
            {id: 3, name: "Saude", description: "Plano de Saude, Remedios"},
            {id: 4, name: "Carro", description: "Combustive, Seguro, Parcela"}
        ];

        return { categories };
    }
    
}