import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import { switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErroMessages: string[] = null;
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(){
    this.setPageTitle();
  }

  subtmitForm(){
    this.submittingForm = true;

    if(this.currentAction == "new"){
      this.createCategory();
    }else{
      this.updateCategory();
    }
  }

  //PRIVATE METHODS:
   private setCurrentAction(){
    if(this.route.snapshot.url[0].path == "new"){
      this.currentAction = "new";
    }else{
      this.currentAction = "edit";
    }
  }

  private buildCategoryForm(){
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory(){
    if(this.currentAction == "edit"){
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get("id")))
      )
      .subscribe(
        (category) => {
          this.category = category;
          console.log(this.category);
          
          this.categoryForm.patchValue(this.category); // Carrega a categoria para a edição!!!
        },
        (error => alert("Ocorreu um erro no servidor, tente novamente mais tarde"))
      )
    }
  }

  private setPageTitle(){
    if(this.currentAction == "new"){
      this.pageTitle = "Cadastro de Nova Categoria";
    }else{
      const categoryName = this.category.name || "";
      this.pageTitle = "Editando Categoria: " + categoryName;
    }
  }

  private createCategory(){
    const category: Category = Object.assign(new Category(), this.categoryForm.value);  

    this.categoryService.create(category)
    .subscribe(
      category => this.actionsFormSuccess(category),
      error => this.actionsFormError(error)
    );
  }

  private updateCategory(){
    const category: Category = Object.assign(new Category(), this.categoryForm.value);  

    this.categoryService.update(category)
    .subscribe(
      category => this.actionsFormSuccess(category),
      error => this.actionsFormError(error)
    );
  }

  private actionsFormSuccess(category: Category){
    this.toastr.success("Solicitação processada com sucesso!");
    this.router.navigate(["categories"]);
  }

  private actionsFormError(error){
    this.toastr.error("Ocorreu um erro ao processar a sua solicitação");

    this.submittingForm = false;

    if(error.status === 422){
      this.serverErroMessages = JSON.parse(error._body).errors;
    }else{
      this.serverErroMessages = ["Falha na comunicação com o servidor. Por favor tente mais tarde."]
    }
  }

}
