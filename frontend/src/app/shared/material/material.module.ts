import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  // imports: [
  //   CommonModule,
  //   MatInputModule,
  //   MatFormFieldModule,
  //   MatCardModule,
  //   MatButtonModule,
  //   MatToolbarModule,
  //   MatExpansionModule,
  //   MatIconModule,
  // ],
  exports: [
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatIconModule,
  ],
})
export class MaterialModule {}
