import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxDropzoneComponent } from 'ngx-dropzone';
import { first } from 'rxjs/operators';
import { CardFieldType } from 'src/app/_models/card';
import { CardService } from 'src/app/_services/card.service';
import { FileService } from 'src/app/_services/file.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
	selector: 'app-card-form',
	templateUrl: './card-form.component.html',
	styleUrls: ['./card-form.component.css']
})
export class CardFormComponent implements OnInit {
	files: File[] = [];
	fieldTypes: CardFieldType[] = [];
	imagePath: string;
	form: FormGroup;
	id: string;
	isAddMode: boolean;
	loading = false;
	submitted = false;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private cardService: CardService,
		private fileService: FileService,
		private sanitizer: DomSanitizer,
		private notificationService: NotificationService
	) { }

	ngOnInit(): void {
		this.id = this.route.snapshot.params['id'];
		this.isAddMode = !this.id;

		this.form = this.formBuilder.group({
			// imageName: '',
			fields: this.formBuilder.array([])
			//fields: this.formBuilder.array([this.formBuilder.control('', Validators.required)]) // FIXME - why is it creating a new form?
			// - FIXME - I can't do this, it will break file uploader
		});

		this.cardService.getFieldTypes()
			.pipe(first())
			.subscribe(fieldTypes => {
				this.fieldTypes = fieldTypes;
			});

		if (!this.isAddMode) {
			this.cardService.get(this.id)
				.pipe(first())
				.subscribe(card => {
					this.imagePath = card.imagePath;
					// this.form.patchValue({
					// 	imageName: card.imagePath
					// })

					for (let field of card.fields) {
						let name: FormControl = new FormControl('');
						let fieldTypeId: FormControl = new FormControl('');

						name.setValue(field.name);
						fieldTypeId.setValue(field.fieldTypeId);

						this.fields.push(new FormGroup({
							name: name,
							fieldTypeId: fieldTypeId
						}));
					}
				});

			// FIXME - This doesn't work
			// this.fileService.get("088df7e7-20fc-43d8-beb9-24a3041eda75")
			// 	.pipe(first())
			// 	.subscribe(file => {
			// 		this.files.push(file);
			// 	});
		}
	}

	sanitize(url:string){
		return this.sanitizer.bypassSecurityTrustUrl(url);
	}

	onSelect(event) {
		console.log(event);
		this.files.shift(); // FIXME - workaround, better to remove array and have only one File variable
		this.files.push(...event.addedFiles);
	}

	onRemove(event) {
		console.log(event);
		this.files.splice(this.files.indexOf(event), 1);
	}

	get fields(): FormArray {
		return this.form.get("fields") as FormArray
	}

	newField(): FormGroup {
		return this.formBuilder.group({
			name: '',
			fieldTypeId: '',
		})
	}

	addField() {
		this.fields.push(this.newField());
	}

	removeField(i: number) {
		this.fields.removeAt(i);
	}

	progress: { percentage: number } = { percentage: 0 };

	onSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.form.invalid) {
			return;
		}

		this.loading = true;
		if (this.isAddMode) {
			this.createCard();
		} else {
			this.updateCard();
		}
	}

	private createCard() {
		this.cardService.register(this.files[0], this.form.value)
			.pipe(first())
			.subscribe(
				data => {
					this.notificationService.success('Registration successful');
					this.router.navigate(['..', { relativeTo: this.route }]);
				},
				error => {
					this.notificationService.error(error);
					this.loading = false;
				}
			);
	}

	private updateCard() {
		this.cardService.update(this.id, this.files[0], this.form.value)
			.pipe(first())
			.subscribe(
				data => {
					this.notificationService.success('Update successful');
					this.router.navigate(['..', { relativeTo: this.route }]);
				},
				error => {
					this.notificationService.error(error);
					this.loading = false;
				}
			);
	}
}