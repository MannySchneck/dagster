import {NonIdealState} from '@blueprintjs/core';
import * as React from 'react';
import {Link} from 'react-router-dom';

import {useFeatureFlags} from '../app/Flags';
import {Group} from '../ui/Group';
import {LoadingSpinner} from '../ui/Loading';
import {Page} from '../ui/Page';
import {PageHeader} from '../ui/PageHeader';
import {Table} from '../ui/Table';
import {Heading} from '../ui/Text';

import {useRepositoryOptions} from './WorkspaceContext';
import {buildRepoPath} from './buildRepoAddress';
import {workspacePath} from './workspacePath';

export const WorkspaceOverviewRoot = () => {
  const {loading, error, options} = useRepositoryOptions();
  const {flagPipelineModeTuples} = useFeatureFlags();

  const content = () => {
    if (loading) {
      return <LoadingSpinner purpose="page" />;
    }

    if (error) {
      return (
        <NonIdealState
          icon="cube"
          title="Error loading repositories"
          description="Could not load repositories in this workspace."
        />
      );
    }

    if (!options.length) {
      return (
        <NonIdealState
          icon="cube"
          title="Empty workspace"
          description="There are no repositories in this workspace."
        />
      );
    }

    return (
      <Table>
        <thead>
          <tr>
            <th>Repository</th>
            {flagPipelineModeTuples ? (
              <>
                <th>Jobs</th>
                <th>Graphs</th>
              </>
            ) : (
              <th>Pipelines</th>
            )}
            <th>Solids</th>
            <th>Schedules</th>
            <th>Sensors</th>
          </tr>
        </thead>
        <tbody>
          {options.map((repository) => {
            const {
              repository: {name},
              repositoryLocation: {name: location},
            } = repository;
            const repoString = buildRepoPath(name, location);
            return (
              <tr key={repoString}>
                <td style={{width: '40%'}}>{repoString}</td>
                {flagPipelineModeTuples ? (
                  <>
                    <td>
                      <Link to={workspacePath(name, location, '/jobs')}>Jobs</Link>
                    </td>
                    <td>
                      <Link to={workspacePath(name, location, '/graphs')}>Graphs</Link>
                    </td>
                  </>
                ) : (
                  <td>
                    <Link to={workspacePath(name, location, '/pipelines')}>Pipelines</Link>
                  </td>
                )}
                <td>
                  <Link to={workspacePath(name, location, '/solids')}>Solids</Link>
                </td>
                <td>
                  <Link to={workspacePath(name, location, '/schedules')}>Schedules</Link>
                </td>
                <td>
                  <Link to={workspacePath(name, location, '/sensors')}>Sensors</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };

  return (
    <Page>
      <Group direction="column" spacing={16}>
        <PageHeader title={<Heading>Workspace</Heading>} />
        {content()}
      </Group>
    </Page>
  );
};
