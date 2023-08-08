import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from 'src/app/model/transactionRequest';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'filter'})
export class FilterTransaction implements PipeTransform {

    transform(list: Transaction[], value: string) {
        return value ? list.filter(item => item.status === value) : list;
      }
}