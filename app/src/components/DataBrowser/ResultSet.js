// @flow

import React from 'react';
import { ReactiveList } from '@appbaseio/reactivesearch';
import { connect } from 'react-redux';
import { css } from 'react-emotion';
import { mediaMin } from '@divyanshu013/media';

import DataTable from '../DataTable';
import Flex from '../Flex';
import Loader from '../Loader';

import { numberWithCommas, getUrlParams } from '../../utils';
import { getSort } from '../../reducers/sort';
import { getPageSize } from '../../reducers/pageSize';
import { getAppname } from '../../reducers/app';
import { getReactiveListKey } from '../../reducers/data';
import {
	getTermsAggregationColumns,
	getMappings,
} from '../../reducers/mappings';
import { setSelectedRows, setUpdatingRow } from '../../actions';
import colors from '../theme/colors';

type Props = {
	reactiveListKey: number,
	sortField: string,
	sortOrder: string,
	pageSize: number,
	termsAggregationColumns: any,
	onSelectedRows: any => void,
	onSetUpdatingRow: any => void,
	mappings: any,
	appname: string,
	height: number,
	width: number,
	headerRef: any,
};

const ResultSet = ({
	reactiveListKey,
	sortField,
	sortOrder,
	pageSize,
	termsAggregationColumns,
	onSelectedRows,
	onSetUpdatingRow,
	mappings,
	appname,
	height,
	width,
	headerRef,
}: Props) => {
	const { results } = getUrlParams(window.location.search);
	const currentPage = parseInt(results || 1, 10);
	return (
		<ReactiveList
			key={String(reactiveListKey)}
			componentId="results"
			dataField={sortField}
			sortBy={sortOrder}
			pagination
			size={pageSize}
			showResultStats
			URLParams
			currentPage={currentPage}
			react={{
				and: [
					'GlobalSearch',
					...termsAggregationColumns,
					'indexField',
					'typeField',
				],
			}}
			style={{
				position: 'relative',
				overflow: 'visible',
			}}
			innerClass={{
				poweredBy: css({
					display: 'none',
				}),
				pagination: css({
					position: 'absolute',
					right: 40,
					zIndex: 105,
					'.active': {
						backgroundColor: `${colors.primary} !important`,
					},
				}),
			}}
			loader={
				<Flex
					justifyContent="center"
					css={{
						minHeight: 150,
						position: 'absolute',
						top: 32,
						left: 2,
						right: 2,
						bottom: 2,
						zIndex: 1000,
						background: colors.white,
					}}
					id="spinner"
				>
					<Loader />
				</Flex>
			}
			onPageChange={() => {
				onSelectedRows([]);
				onSetUpdatingRow(null);
			}}
			onAllData={data =>
				data.length ? (
					<DataTable
						key={data.length ? data[0]._id : '0'}
						data={data}
						mappings={mappings[appname]}
						height={height}
						width={width}
						headerRef={headerRef}
					/>
				) : null
			}
			onResultStats={total => (
				<Flex
					justifyContent="center"
					alignItems="center"
					css={{
						display: 'none',
						[mediaMin.medium]: {
							display: 'block',
							position: 'absolute',
							right: '390px',
							height: '32px',
							fontSize: '14px',
							padding: '0 15px',
							lineHeight: '1.5',
							textAlign: 'center',
							bottom: -45,
						},
					}}
				>
					<b>{numberWithCommas(total)}</b>
					&nbsp;results
				</Flex>
			)}
		/>
	);
};

const mapStateToProps = state => {
	const { field: sortField, order: sortOrder } = getSort(state);
	return {
		appname: getAppname(state),
		termsAggregationColumns: getTermsAggregationColumns(state),
		sortField,
		sortOrder,
		pageSize: getPageSize(state),
		reactiveListKey: getReactiveListKey(state),
		mappings: getMappings(state),
	};
};

const mapDispatchToProps = {
	onSelectedRows: setSelectedRows,
	onSetUpdatingRow: setUpdatingRow,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ResultSet);
